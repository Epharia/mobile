
/**
 * Draws a filled Circle
 */
export function fillCircle(ctx, x = 0, y = 0, radius = 32, fillStyle = "rgba(255, 255, 255 , 1)", glow = false) {
    ctx.save();

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.closePath();

    if (glow) {
        ctx.shadowColor = 'rgba(255, 100, 100, 0.6)';
        ctx.shadowBlur = 16;
    }

    ctx.fillStyle = fillStyle;
    ctx.fill();

    ctx.restore();
}

/**
 * Draws a filled isosceles triangle
 */
export function fillTriangle(ctx, x = 0, y = 0, width = 32, height = 32, angle = 0, fillStyle = "rgba(255, 255, 255, 1)", glow = false) {
    ctx.save();

    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 2);

    ctx.beginPath();
    ctx.moveTo(0, -height / 2);
    ctx.lineTo(-width / 2, height / 2);
    ctx.lineTo(width / 2, height / 2);
    ctx.closePath();

    if (glow) {
        ctx.shadowColor = 'rgba(255, 100, 100, 0.6)';
        ctx.shadowBlur = 16;
    }

    ctx.fillStyle = fillStyle;
    ctx.fill();

    ctx.restore();
}