function xScale(data, xVariable) {
    const xLinearScale = d3
        .scaleLinear()
        .range([0, chartW])
        .domain([d3.min(data, d => d[xVariable]) * 0.8,
            (d3.max(data, d => d[xVariable])) * 1.2]);
    return xLinearScale;
};
// Sets up y axis.
function yScale(data, yVariable) {
    const yLinearScale = d3
        .scaleLinear()
        .range([chartH, 0])
        .domain([d3.min(data, d => d[yVariable]) * 0.8,
            (d3.max(data, d => d[yVariable])) * 1.2]);
    return yLinearScale;
};
// Draws circles.
function renderCircles(circlesGroup, newXScale, newYScale, xVariable, yVariable) {
    circlesGroup
        .transition()
        .duration(1000)
        .attr('cx', d => newXScale(d[xVariable]))
        .attr('cy', d => newYScale(d[yVariable]));
    return circlesGroup;
};
// Draws abbr labels.
function renderAbbrs(abbrGroup, newXScale, newYScale, xVariable, yVariable) {
    abbrGroup
        .transition()
        .duration(1000)
        .attr('x', d => newXScale(d[xVariable]) - 12)
        .attr('y', d => newYScale(d[yVariable]) + 5);
    console.log(abbrGroup)
    return abbrGroup;
};
// Draws x axis.
function renderX(newXScale, xAxis) {
    const bottomAxis = d3  
        .axisBottom(newXScale);
    xAxis
        .transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
};
// Draws y axis.
function renderY(newYScale, yAxis) {
    const leftAxis = d3
        .axisLeft(newYScale);
    yAxis
        .transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
};