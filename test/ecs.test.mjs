import test from 'node:test';
import assert from 'node:assert/strict';

import { EventService, EventTypes } from '../engine/services/event.mjs';
import { ServiceContainer, SERVICE_KEYS } from '../engine/services.mjs';
import { EntityManager } from '../entity/entityManager.mjs';
import { Component } from '../entity/component.mjs';
import { Query } from '../entity/query.mjs';
import { System } from '../entity/system.mjs';
import { SystemManager } from '../entity/systemManager.mjs';

class DummyComponent extends Component { }

function createServices() {
    const services = new ServiceContainer();
    const events = new EventService();
    services.register(SERVICE_KEYS.EVENTS, events);
    return { services, events };
}

test('ServiceContainer prevents duplicate registration by default', () => {
    const services = new ServiceContainer();
    services.register(SERVICE_KEYS.EVENTS, new EventService());

    assert.throws(
        () => services.register(SERVICE_KEYS.EVENTS, new EventService()),
        /already registered/
    );
});

function runQueryInvalidationScenario({
    name,
    setupInitialState,
    mutate,
    expectedCountAfterMutation,
    expectedDirtyBeforeMutation = false,
    assertAfterMutation = () => { }
}) {
    const { services } = createServices();
    const entityManager = new EntityManager(services);
    const query = new Query(entityManager, DummyComponent);

    const context = setupInitialState({ entityManager, query });

    assert.equal(
        query.isCacheDirty(),
        expectedDirtyBeforeMutation,
        `[${name}] Unexpected cache dirty state before mutation`
    );

    mutate({ entityManager, query, ...context });

    assert.equal(query.isCacheDirty(), true, `[${name}] Expected query cache to be marked dirty after mutation`);

    const afterMutation = query.execute();
    assert.equal(
        afterMutation.length,
        expectedCountAfterMutation,
        `[${name}] Unexpected query result count after mutation`
    );
    assert.equal(query.isCacheDirty(), false, `[${name}] Expected cache to be clean after execute`);

    assertAfterMutation({ entityManager, query, afterMutation, ...context });
}

test('EntityManager wires EventService for component events', () => {
    const { services, events } = createServices();
    const entityManager = new EntityManager(services);

    let received = null;
    events.subscribe(EventTypes.COMPONENT_ADDED, (data) => {
        received = data;
    });

    const entity = entityManager.createEntity('test');
    entity.addComponent(new DummyComponent());

    assert.ok(received, 'Expected COMPONENT_ADDED event to be emitted');
    assert.equal(received.entity, entity);
    assert.equal(received.component.constructor, DummyComponent);
});

test('Query cache invalidates on component add and removal', () => {
    runQueryInvalidationScenario({
        name: 'component add',
        setupInitialState: ({ entityManager, query }) => {
            assert.equal(query.isCacheDirty(), true);
            assert.equal(query.getCache(), null);
            assert.equal(query.execute().length, 0);

            const entity = entityManager.createEntity('q1');
            assert.equal(query.isCacheDirty(), true);
            return { entity };
        },
        expectedDirtyBeforeMutation: true,
        mutate: ({ entity }) => {
            entity.addComponent(new DummyComponent());
        },
        expectedCountAfterMutation: 1,
        assertAfterMutation: ({ entity, query, afterMutation }) => {
            assert.equal(afterMutation[0], entity);
            assert.equal(query.getCache(), afterMutation);
            assert.equal(query.execute(), afterMutation);
        }
    });

    runQueryInvalidationScenario({
        name: 'component removal',
        setupInitialState: ({ entityManager, query }) => {
            const entity = entityManager.createEntity('remove-test');
            entity.addComponent(new DummyComponent());
            assert.equal(query.execute().length, 1, 'Expected query to find entity with component');
            return { entity };
        },
        mutate: ({ entity }) => {
            entity.removeComponent(DummyComponent);
        },
        expectedCountAfterMutation: 0
    });
});

test('SystemManager passes services to systems on init', () => {
    const { services } = createServices();
    const entityManager = new EntityManager(services);
    const systemManager = new SystemManager(entityManager, services);

    class TestSystem extends System {
        init(servicesArg) {
            super.init(servicesArg);
            this.initCalled = true;
        }
    }

    const sys = new TestSystem();
    systemManager.addSystem(sys);

    assert.ok(sys.initCalled, 'Expected init to be called');
    assert.ok(sys.services, 'Expected services to be set on system');
    assert.ok(sys.services.has(SERVICE_KEYS.EVENTS));
});
