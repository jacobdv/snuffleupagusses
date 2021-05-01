// Renders scatterplot and initial dimensions.
let xVariable = 'MedianIncome';
let yVariable = 'PopulationWithHighSpeedInternet';
let region = 'all-states';
// Add SVG element to scatter div.
const svg = d3
    .select('div.scatterplot')
    .append('svg')
    .attr('height', svgH)
    .attr('width', svgW)
    .attr('style','border: 2px solid black; background-color:white'); 
// Add chart group to the SVG.
const chartGroup = svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// Update scatterplot.
function xScale(dataJSON, xVariable) {
    const xLinearScale = d3.scaleLinear()
        .range([0, chartW])
        .domain([0, (d3.max(dataJSON, d => d[xVariable]) * 1.2)]);
    return xLinearScale;
};
function yScale(dataJSON, yVariable) {
    const yLinearScale = d3.scaleLinear()
        .range([chartH, 0])
        .domain([0, (d3.max(dataJSON, d => d[yVariable]) * 1.2)]);
    return yLinearScale;
}
function renderX(newXScale, xAxis) {
    const bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition().duration(aDuration).call(bottomAxis);
    return xAxis;
}
function renderY(newYScale, yAxis) {
    const leftAxis = d3.axisLeft(newYScale);
    yAxis.transition().duration(aDuration).call(leftAxis);
    return yAxis;
}

function drawCircles(xLinearScale, yLinearScale, dataset, xVariable, yVariable) {
    circlesGroup = chartGroup.selectAll('circle').data(dataset).join('circle')
        .attr('cx', d => xLinearScale(d[xVariable]))
        .attr('cy', d => yLinearScale(d[yVariable]))
        .attr('r', 5).attr('fill', 'cornflowerblue')
        .attr('class','circle')
        .attr('opacity', 0).attr('stroke', 'black').attr('stroke-width', 0.75);
    return circlesGroup;
}

function transitionIn(circlesGroup) {
    circlesGroup.transition().duration(duration).attr('opacity', 0.95);
    return circlesGroup;
};

function transitionOut(circlesGroup) {
    circlesGroup.transition().duration(duration).attr('opacity', 0)
    return circlesGroup;
};

// Data interaction.
Promise.all([d3.json(cityLink), d3.json(stateLink)]).then(([citiesData, statesData]) => {
    // Toggle for dataset.
    let dataset = statesData;

    // Adds all the states as options for the dropdown menu.
    let dropdownMenu = d3.select('#selDataset');
    statesData.forEach(state => {
        dropdownMenu.append('option').text(state.state).attr('value',state.state);
    });

    // Initial scatterplot.
    let xLinearScale = xScale(dataset, xVariable);
    let bottomAxis = d3.axisBottom(xLinearScale);
    let xAxis = chartGroup.append('g').classed('x-axis', true)
        .attr('transform', `translate(0, ${chartH})`).call(bottomAxis);
    let yLinearScale = yScale(dataset, yVariable);
    let leftAxis = d3.axisLeft(yLinearScale);
    let yAxis = chartGroup.append('g').classed('y-axis', true)
        .call(leftAxis);

    // Initial state cirles.
    let circlesGroup = drawCircles(xLinearScale, yLinearScale, dataset, xVariable, yVariable);
    transitionIn(circlesGroup);

    // Calls function to update scatterplot on selection change.
    d3.select('#selDataset').on('change', function() {
        // Sets region to selection and calls function to replot.
        let selectedRegion = dropdownMenu.property('value');
        // let demoPanel = d3.select('#sp-demographics').html('');

        // If indicates state-level data. Else indicates city data for a selected state.
        if (selectedRegion === 'all-states') {
            dataset = statesData;
            circlesGroup = transitionOut(circlesGroup);
            xLinearScale = xScale(dataset, xVariable);
            xAxis = renderX(xLinearScale, xAxis);
            yLinearScale = yScale(dataset, yVariable);
            yAxis = renderY(yLinearScale, yAxis);
            circlesGroup = drawCircles(xLinearScale, yLinearScale, dataset, xVariable, yVariable);  
            transitionIn(circlesGroup);     
            // Demographics part.
            // demoPanel.append('h3').text(`All States`)   
        } else {
            d3.json(`http://127.0.0.1:5000/api/cities/${selectedRegion}/`).then(data => {
                dataset = data;
                circlesGroup = transitionOut(circlesGroup);
                xLinearScale = xScale(dataset, xVariable);
                xAxis = renderX(xLinearScale, xAxis);
                yLinearScale = yScale(dataset, yVariable);
                yAxis = renderY(yLinearScale, yAxis);
                circlesGroup = drawCircles(xLinearScale, yLinearScale, dataset, xVariable, yVariable);  
                transitionIn(circlesGroup);  
                // Demographics part.
                // demoPanel.append('h3').text(selectedRegion)
                // demoPanel.append('p').text(`${statesData}`)
                // console.log(statesData)
            })
        }
    });

    // Labels
    const xGroup = chartGroup.append('g')
        .attr("transform", `translate(${chartW / 2}, ${chartH + 20})`);
    const xIncomeLabel = xGroup.append('text')
        .attr('x', 0).attr('y', 20).attr('value', 'MedianIncome')
        .classed('active', true).text('Median Income');
    const xHSDiplomaLabel = xGroup.append('text')
        .attr('x', 0).attr('y', 40).attr('value', 'PopulationWithHighSchoolDiploma')
        .classed('inactive', true).text('Population With High School Diploma');
    const xBachelorLabel = xGroup.append('text')
        .attr('x', 0).attr('y', 80).attr('value', 'PopulationWithBachelorsDegree')
        .classed('inactive', true).text("Population With Bachelor's Degree");
    const xAssociateLabel = xGroup.append('text')
        .attr('x', 0).attr('y', 60).attr('value', 'PopulationWithAssociatesDegree')
        .classed('inactive', true).text("Population With Associate's Degree");
    const yGroup = chartGroup
        .append('g')
    const yIncomeLabel = yGroup 
        .append('text').attr('transform', 'rotate(-90)')
        .attr('x', -(chartH/2)).attr('y', -70)
        .attr('value', 'PopulationWithHighSpeedInternet')
        .classed('active', true).text('Population With High Speed Internet');


    // Axis update listener.
    xGroup
        .selectAll('text')
        .on('click', function() {
            const xValue = d3
            .select(this)
            .attr('value');
            selectedRegion = dropdownMenu.property('value');
            if (xValue !== xVariable) {
                xVariable = xValue;
                circlesGroup = transitionOut(circlesGroup);
                xLinearScale = xScale(dataset, xVariable);
                xAxis = renderX(xLinearScale, xAxis);
                yLinearScale = yScale(dataset, yVariable);
                yAxis = renderY(yLinearScale, yAxis);
                circlesGroup = drawCircles(xLinearScale, yLinearScale, dataset, xVariable, yVariable);  
                transitionIn(circlesGroup);              
                if (xVariable === 'PopulationWithHighSchoolDiploma') {
                    xHSDiplomaLabel
                        .classed('active', true)
                        .classed('inactive', false);
                    xIncomeLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    xBachelorLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    xAssociateLabel
                        .classed('active', false)
                        .classed('inactive', true);
                } else if (xVariable === 'MedianIncome') {
                    xHSDiplomaLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    xIncomeLabel
                        .classed('active', true)
                        .classed('inactive', false);
                    xBachelorLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    xAssociateLabel
                        .classed('active', false)
                        .classed('inactive', true);
                } else if (xVariable === 'PopulationWithBachelorsDegree') {
                    xHSDiplomaLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    xIncomeLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    xBachelorLabel
                        .classed('active', true)
                        .classed('inactive', false);
                    xAssociateLabel
                        .classed('active', false)
                        .classed('inactive', true);
                } else if (xVariable === 'PopulationWithAssociatesDegree') {
                    xHSDiplomaLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    xIncomeLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    xBachelorLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    xAssociateLabel
                        .classed('active', true)
                        .classed('inactive', false);
                }
            }        
        })
}).catch(error => console.log(error));