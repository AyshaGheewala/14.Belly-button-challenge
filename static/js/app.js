// MODULE 14 CHALLENGE

// Get the samples.json endpoint
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Initializes the page 
function init() {
    // Extract all the idNumbers and append to the dropdownMenu
    dropDownMenu = d3.select("#selDataset");
    d3.json(url).then(function(data) {
        console.log(data);
        var idNumbers = data.names;
        idNumbers.forEach((id)=>{
            dropDownMenu.append('option').text(id).property('value'); 
        });

        // Add a default plot for id 940:
        // Extract the first idNumber from idNumbers and assign it a variable
        // Run function to add Demographic Info and Charts for id 940.
        firstId = idNumbers[0];
        addCharts(firstId);
        addDemoInfo(firstId); 
    });
};

// Call optionChanged() when idNumber is changed from the dropdown menu
selectId = d3.select("#selDataset").on("change", optionChanged);

function optionChanged(id){
    addCharts(id);
    addDemoInfo(id);
};


// Display the charts with addCharts function
function addCharts(id) {
    barChart = d3.select("#bar");
    bubbleChart = d3.select("#bubble");
    // Extract the chart info
    d3.json(url).then(function(data) {
        var chartInfo = data.samples;
        var chartInfoFiltered = chartInfo.filter(info => info.id == id)[0];
        var otuIds = chartInfoFiltered.otu_ids;
        var topOtuIds = otuIds.slice(0,10);
        var topOtuIdsString = topOtuIds.map(ids => "OTU " + ids);
        var sampleValues = chartInfoFiltered.sample_values;
        var topSampleValues = sampleValues.slice(0,10);
        var otuLabels = chartInfoFiltered.otu_labels;
        var topOtuLabels = otuLabels.slice(0,10);
        
        //Plot the bar chart
        var trace = {
        x: topSampleValues.reverse(),
        y: topOtuIdsString.reverse(),
        type: "bar",
        orientation: 'h',
        text: topOtuLabels.reverse()
        };

        var data = [trace];

        var layout = {
        xaxis: {title: "Count"}
        };

        Plotly.newPlot("bar", data, layout);


        //Plot the bubble chart
        var trace = {
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
            size: sampleValues, 
            color: otuIds
        }
        };

        var data = [trace];

        var layout = {
        xaxis:{title:"OTU ID Number"},
        yaxis:{title:"Count"},
        showlegend: false,
        height: 600,
        width: 1200
        };

        Plotly.newPlot("bubble", data, layout);

    });
};


// Display the demographic info with addDemoInfo function
function addDemoInfo(id){
    demoInfoTable = d3.select("#sample-metadata");
    // Clear the table of any data
    demoInfoTable.html("");
    // Extract the metadata info
    d3.json(url).then(function(data) {
        var demoInfo = data.metadata;
        var demoInfoFiltered = demoInfo.filter(info => info.id == id);
        var infoToAdd = demoInfoFiltered[0];

        // Append to the table
        Object.entries(infoToAdd).forEach(([key, value]) => {
            console.log(key, value);
            demoInfoTable.append("h5").text(`${key}: ${value}`);
        });
    });
};


init();