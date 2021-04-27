/* 
Set up for the chart size and SVG creation.
*/
// Initial parameters and definitions.
const svgH = 500;
const svgW = 960;
const margin = { top:20, right:40, bottom:80, left:100 };
const chartH = svgH - (margin.top + margin.bottom);
const chartW = svgW - (margin.left + margin.right);
let xVariable = 'MedianIncome';
let yVariable = 'PopulationWithHighSpeedInternet';
// Add SVG element to scatter div.
const svg = d3
    .select('#scatterplot')
    .append('svg')
    .attr('height', svgH)
    .attr('width', svgW);
// Add chart group to the SVG.
const chartGroup = svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);


//////////////////////////////////////////////////


/*
Functions for drawing the chart and updating it.
*/
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
    console.log(circlesGroup)
    return circlesGroup;
};
// Draws x axis.
function renderX(newXScale, xAxis) {
    const bottomAxis = d3  
        .axisBottom(newXScale);
    xAxis
        .transition()
        .duration(2000)
        .call(bottomAxis);
    return xAxis;
};


//////////////////////////////////////////////////


/*
Set up based on initial variables.
*/
// Import data.
d3.csv('data/internet_census_combined.csv').then(data => {
    // Retyping the data to be used.
    data.forEach(data => {
        data.MedianIncome = +data.MedianIncome;
        data.PopulationWithHighSpeedInternet = +data.PopulationWithHighSpeedInternet;
    });
    // Function calls.
    // Creating x scale and x axis on the chart.
    let xLinearScale = xScale(data, xVariable);
    const bottomAxis = d3
        .axisBottom(xLinearScale);
    let xAxis = chartGroup
        .append('g')
        .classed('x-axis', true)
        .attr('transform', `translate(0, ${chartH})`)
        .call(bottomAxis);
    // Creating y scale and y axis on the chart.
    let yLinearScale = yScale(data, yVariable);
    const leftAxis = d3
        .axisLeft(yLinearScale);
    let yAxis = chartGroup
        .append('g')
        .classed('y-axis', true)
        .call(leftAxis);
    // Making the circles.
    let circlesGroup = chartGroup
        .selectAll('circle')
        .data(data)
        .join('circle')
        .attr('cx', d => xLinearScale(d[xVariable]))
        .attr('cy', d => yLinearScale(d[yVariable]))
        .attr('r', 5)
        .attr('fill', 'cornflowerblue')
        .attr('opacity', 0.95)
        .attr('stroke', 'black')
        .attr('stroke-width', 0.75);

    // Axes labels
    // X Axis
    const xGroup = chartGroup
        .append('g')
        .attr("transform", `translate(${chartW / 2}, ${chartH + 20})`);
    const xIncomeLabel = xGroup 
        .append('text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'MedianIncome')
        .classed('active', true)
        .text('Median Income');
    const xHSDiplomaLabel = xGroup 
        .append('text')
        .attr('x', 0)
        .attr('y', 40)
        .attr('value', 'PopulationWithHighSchoolDiploma')
        .classed('inactive', true)
        .text('Population With High School Diploma');
    // Y Axis
    const yGroup = chartGroup
        .append('g')
    const yIncomeLabel = yGroup 
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -(chartH/2))
        .attr('y', -70)
        .attr('value', 'Population With High Speed Internet')
        .classed('active', true)
        .text('Population With High Speed Internet');


//////////////////////////////////////////////////


/*
Set up for updating variables on click.
*/
    // Grouping for x labels.
    xGroup
        .selectAll('text')
        .on('click', function() {
            const xValue = d3
                .select(this)
                .attr('value');
            if (xValue !== xVariable) {
                xVariable = xValue;
                xLinearScale = xScale(data, xVariable);
                xAxis = renderX(xLinearScale, xAxis);
                circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, xVariable, yVariable);
                if (xVariable === 'PopulationWithHighSchoolDiploma') {
                    xHSDiplomaLabel
                        .classed('active', true)
                        .classed('inactive', false);
                    xIncomeLabel
                        .classed('active', false)
                        .classed('inactive', true);
                } else if (xVariable === 'MedianIncome') {
                    xHSDiplomaLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    xIncomeLabel
                        .classed('active', true)
                        .classed('inactive', false);
                }
            }
        })
}).catch(error => console.log(error));




