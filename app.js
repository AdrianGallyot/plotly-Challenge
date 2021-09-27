function optionChanged(sample){
    d3.json("samples.json").then((data) => { 

    var samples = data.samples;

    var resultsArray = samples.filter(sampleObj => sampleObj.id == sample);

    var result = resultsArray[0];

    var metadata = data.metadata;

    var metadata_filter = metadata.filter(sampleObj => sampleObj.id == sample);

    var result_meta = metadata_filter[0];

 
    var otu_labels = result.otu_labels;
    var otu_ids = result.otu_ids;
    var sample_values = result.sample_values;


    console.log(sample_values);
    console.log(otu_ids);
    console.log(otu_labels);
    console.log(result_meta);

    BuildPlot(sample,sample_values, otu_labels, otu_ids);

    var otu_ids = result.otu_ids.slice(0,10);
    var sample_values = result.sample_values.slice(0,10);
    var otu_ids_rev = otu_ids.reverse();
    var samples_rev = sample_values.reverse();

    var axislabels = [];

    for (var i = 0; i < samples_rev.length ; i++){
      axislabels.push(`OTU ${otu_ids_rev[i]}`);
    }
    
    // console.log(samples.id);
    // console.log(sample_values);
    // console.log(otu_ids);
    // console.log(otu_labels);
    // console.log(axislabels);
    // console.log(result_meta);
    console.log(axislabels);

    buildBody(result_meta); // Call metadata update function
    BuildGuage(result_meta);


    var trace = {
      type: "bar",
      name: otu_labels,
      x: sample_values,
      y: axislabels,
      labels: otu_labels,
      orientation: "h",
      line:{
        color: "#17BECF",
        width: 5
      }
    };

    var data = [trace];

    var layout = {
      title: `ID ${sample} Top 10 OTU`,
    }

    Plotly.newPlot('bar', data, layout);
  });
}

function buildBody(result_meta) {
  var Panel = d3.select("#sample-metadata");
  Panel.html(""); // too Clear Previous metadata
  Panel.append("div").text(`Id: ${result_meta.id}`);
  Panel.append("div").text(`ethnicity: ${result_meta.ethnicity}`);
  Panel.append("div").text(`gender: ${result_meta.gender}`);
  Panel.append("div").text(`age: ${result_meta.age}`);
  Panel.append("div").text(`location: ${result_meta.location}`);
  Panel.append("div").text(`wfreq: ${result_meta.wfreq}`);
}


// Append the Drop down list with all the otu_ids on page load
function init() {
  d3.json("samples.json").then((data) => { 

  var names = data.names;

  let dropdown = document.getElementById('selDataset');
  dropdown.length = 0;

  let defaultOption = document.createElement('option');
  defaultOption.text = 'Select';

  dropdown.add(defaultOption);
  dropdown.selectedIndex = 0;
  let option;
    for (let i = 0; i < names.length; i++) {
      option = document.createElement('option');
      option.text = names[i];
      option.value = names[i];
      dropdown.add(option);
    }
  });
}

init();

function BuildPlot(sample,sample_values, otu_labels, otu_ids){

  var trace1 = {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: 'markers',
    marker: {
      color: otu_ids,
      size: sample_values
    }
  };
  
  var data = [trace1];
  
  var layout = {
    title: `ID ${sample} Bubble Plot`,
    xaxis: { title: "OTU ID" },
    showlegend: false,
    height: 700,
    width: 1200
  };
  
  Plotly.newPlot('bubble', data, layout);
}

function BuildGuage(result_meta){
  var data = [
    {
      domain: { x: [0, 9], y: [0, 9] },
      value: result_meta.wfreq,
      title: {text: "Scrubs per Week"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [0, 9] },
        steps: [
          { range: [0, 1], color: "#ffffff" },
          { range: [1, 2], color: "#f5f5f0" },
          { range: [2, 3], color: "#ebebe0" },
          { range: [3, 4], color: "#bcdcbc" },
          { range: [4, 5], color: "#9acb9a" },
          { range: [5, 6], color: "#78ba78" },
          { range: [6, 7], color: "#68b168" },
          { range: [7, 8], color: "#4e974e" },
          { range: [8, 9], color: "#3d763d" },
        ]
      }
    }
  ];
  
  var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
  Plotly.newPlot('gauge', data, layout);
}