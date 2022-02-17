import React, { useState, useRef, useEffect } from 'react';
import Select from 'react-select'
import './index.css';
import data from './data.json';
import optionsvariable from './optionvariable.json';
import options from './option.json';
import wordlist from './wordlist.json';
import classes from './Site.module.css';
import { Badge, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import StackGrid from "react-stack-grid";
import { Web, Videocam, Description, PictureAsPdf} from '@material-ui/icons';
import ReactGA from 'react-ga';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const App = props => {
  
const locale = "en"
const colorBasket = [
  "#016FB9",
  "#2D9E48",    
  "#a70000",
  "#EC4E20",
    "#353531",
    "#FF9505",
    
    "#D5E0C8",
    "#A36E52",
    "#D5C73E",
    "#D0AACF",
    
    "#7F97BC",
    "#68D7DA",
  ];  

const [selectedOption, setSelectedOption] = useState([{value: 'Angola', label: 'Angola'}]);
const [selectedOptionvar, setSelectedOptionvar] = useState({value: 'Education completed in single years', label: 'Education completed in single years'});
const countrylist = []

selectedOption.map(d=>countrylist.push(d.value))

const filteredData = data.filter(d => countrylist.includes(d.country))
const selectedData = [
  {sbin:0,label:'Rural'},
  {sbin:10,label:'10,000 - 50,000'},
  {sbin:50,label:'50,000 - 250,000'},
  {sbin:250,label:'250,000 - 1,000,000'},
  {sbin:1000,label:'1,000,000+'},
]

filteredData.map(d=>
  selectedData.map(e => 
    e.sbin === d.sbin? e[d.country]=d[selectedOptionvar.value] : null
    )
  )

console.log(selectedData)



const renderTooltip = (props) => {
  if (props.active && props.payload !== null && props.payload[0] !== null) {
    let payload = props.payload[0].payload;
    let tooltip = null;
    
          tooltip = selectedOptionvar.value==='Education completed in single years'? (
            <div className={classes.Tooltip}>            
              {props.payload.map((i, idx) => (
                <p
                  key={idx}
                  style={{
                    color: i.color,
                    marginLeft: "10px",
                    marginRight: "10px",
                  }}
                >
                  {i.dataKey}: {Math.round(i.value * 100) / 100} years
                </p>
              ))}
            </div>
          ) : (
            <div className={classes.Tooltip}>            
              {props.payload.map((i, idx) => (
                <p
                  key={idx}
                  style={{
                    color: i.color,
                    marginLeft: "10px",
                    marginRight: "10px",
                  }}
                >
                  {i.dataKey}: {Math.round(i.value * 1000) / 10}%
                </p>
              ))}
            </div>
          );
        

    return tooltip;
  }
}


const renderLineChart = (
  <BarChart
  width={1000}
  height={600}
  data={selectedData}
  margin={{
    top: 5,
    right: 30,
    left: 20,
    bottom: 5,
  }}
>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="label" />
  <YAxis />
  <Tooltip
      cursor={{ strokeWidth: 0 }}
      content={renderTooltip}      
      language={locale} />
  <Legend />  
  {countrylist.map((d,e) => 
    <Bar dataKey={d} fill={colorBasket[e]}  />
  )}
  
  {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
</BarChart>
);


  
return (
<div class={classes.main}>
  <div class={classes.header}>  
    <div class={classes.title}>{"Data explorer Africa's urban Economy 2022"}</div>    
    <div class={classes.box}>
    <Select 
    // styles={customStyles}
    options={options} 
    isMulti 
    value={selectedOption}
    onChange={setSelectedOption}
    /></div>    
        <div class={classes.box}>
    <Select 
    // styles={customStyles}
    options={optionsvariable} 
    // // isMulti 
    value={selectedOptionvar}
    onChange={setSelectedOptionvar}
    /></div>    

  </div>
  {renderLineChart}
</div>
  );
};

export default App;



