import React, { useState, useCallback } from 'react';
import Select, { components } from 'react-select'
import './index.css';
import data from './data.json';
import optionsvariable from './optionvariable.json';
import options from './option.json';
// import wordlist from './wordlist.json';
import classes from './Site.module.css';
import { FacebookShareButton, FacebookIcon, TwitterIcon, TwitterShareButton} from 'react-share';
// import { Badge, Chip } from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles';
// import StackGrid from "react-stack-grid";
// import { Web, Videocam, Description, PictureAsPdf} from '@material-ui/icons';
// import ReactGA from 'react-ga';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import queryString from "query-string";
import { useLocation, useParams, useHistory } from 'react-router';
import { useCurrentPng } from "recharts-to-png";
import FileSaver from "file-saver";





const App = props => {

const location = useLocation()
const history = useHistory()
const [getPng, { ref, isLoading }] = useCurrentPng();

const handleDownload = useCallback(async () => {
  const png = await getPng();

  // Verify that png is not undefined
  if (png) {
    // Download with FileSaver
    FileSaver.saveAs(png, 'myChart.png');
  }
}, [getPng]);

const queryoption =[]
const queryoptionvar =[]


const queryparse = location.search===""?  "Angola" : queryString.parse(location.search).country 
typeof queryparse==='string'? queryoption.push({value:queryparse,label:queryparse}) : queryparse.map(e => queryoption.push({value:e,label:e}))  
const queryparsevar = location.search===""?  ['Education completed in single years'] : queryString.parse(location.search).type
queryoptionvar.push({value:queryparsevar,label:queryparsevar})

const locale = "en"

const colorBasket = [
  "#a70000",
  "rgb(246,186,112)",
  "rgb(42,79,95)",  
  "rgb(67,107,101)",
  "rgb(133,163,147)",    
  "rgb(197,209,191)",
  "rgb(246,186,112)",
  "rgb(42,79,95)",  
  "rgb(67,107,101)",
  "rgb(133,163,147)",    
  "rgb(197,209,191)",
  "rgb(246,186,112)",
  "rgb(42,79,95)",  
  "rgb(67,107,101)",
  "rgb(133,163,147)",    
  "rgb(197,209,191)",
  ];  


const [selectedOption, setSelectedOption] = useState([{value: 'Angola', label: 'Angola'}]);
const [selectedOptionvar, setSelectedOptionvar] = useState({value: 'hv206no', label: 'Education completed in single years'});
const countrylist = []


queryoption.map(d=>countrylist.push(d.value))

const filteredData = data.filter(d => countrylist.includes(d.EN))
const selectedData = [
  {category:0,label:'Rural'},
  {category:10,label:'10,000 - 50,000'},
  {category:50,label:'50,000 - 250,000'},
  {category:250,label:'250,000 - 1,000,000'},
  {category:1000,label:'1,000,000+'},
]

filteredData.map(d=>
  selectedData.map(e => 
    e.category === d.category? e[d.EN]=d[selectedOptionvar.value] : null
    )
  )

console.log(selectedData)

  const styles = {    
    menu: (base, state) => {
        return {
            ...base,
            backgroundColor: "#ffffff",
            // backgroundColor: "#fef7e7",
            borderRadius: 0,
            boxShadow: 0,
            height: '572px',
            // opacity: ".9"
        }
    },
    option: (base, { isDisabled, isFocused, isSelected }) => {
      return {
        ...base,
        backgroundColor: isSelected ? "#a70000" : null,
        // color: isDisabled
        //   ? '#ccc'
        //   : isSelected
        //   ? chroma.contrast(color, 'white') > 2
        //     ? 'white'
        //     : 'black'
        //   : data.color,
        ':active': {
          // ...styles[':active'],
          // backgroundColor: isSelected ? "#a70000" : "#a70000",
          // opacity: isSelected ? ".4" : ".7",
          // color: isSelected ? "#fef7e7" : ".7",
        },
      }
    },
    menuList: (base, state) => {
        return {
            ...base,
            maxHeight: 'none',
            height: '100%',
        }
    },
    dropdownIndicator: (base, state) => {
      return { ...base,
        
      };
    },
    control: (base, state) => {
      return { ...base,
        isHidden: true, 
        boxShadow: 'none',
        backgroundColor: 'none',
        borderStyle: 'solid', 
        borderColor: '#449999',
        borderWidth: '0px',
        color: 'none', 
        "&:hover": { 
        }
      };
    },
    singleValue: (base, state) => {
      return {
        ...base,
        fontSize:'2rem',
        fontWeight:'600',
        color: '#212529',
      }
    },
    input: (base, state) => {
      return {
        ...base,
        fontSize:'2rem',
        fontWeight:'900',
        color: '#212529'
      }
    }
};


const IndicatorsContainer = props => {  
  return (
    <div className={classes.Control}>
      <div className={classes.ControlInfo}>
        <i className={classes["material-icons"]}> info </i>
        <div className={classes.InfoTooltip}>
            {"indicator explanation"}
        </div>
      </div>
      <components.IndicatorsContainer {...props} />
    </div>
  )
}





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

const styleVar = {
  // indicatorSeparator: (base, state) => {

  // },
  menu: (base, state) => {
      return {
          ...base,
          backgroundColor: "white",
          borderRadius: 0,
          boxShadow: 0,
      }
  },
  option: (base, { isDisabled, isFocused, isSelected }) => {
    return {
      ...base,
      backgroundColor: isDisabled ? "#a70000" : isSelected ? "#a70000" : null,
      ':active': {
      },
    }
  },
  menuList: (base, state) => {
      return {
          ...base,
      }
  },
  control: (base, state) => {
    return { ...base,
      isHidden: true, 
      boxShadow: 'none',
      backgroundColor: 'none',
      borderStyle: 'solid', 
      borderColor: '#449999',
      borderWidth: '0px',
      color: 'none', 
      "&:hover": { 
      }
    };
  },
  singleValue: (base, state) => {
    return {
      ...base,
      color: '#212529',
      textAlign: "right",
    }
  },
  input: (base, state) => {
    return {
      ...base,
      color: '#212529'
    }
  }
};

let renderLineChart = (
  <ResponsiveContainer height="100%" ref={ref}>
      <BarChart 
      // width={1000}
      // height={600}
      data={selectedData}
      margin={{top: 10, right: 20, left: 20, bottom: 10}}
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
      </BarChart>
  </ResponsiveContainer>
);

  
return (
<div class={classes.Layout}>
  <div class={classes.Mixer}>
    <div className={classes.Large}>
      <div className={classes.SearchBar}>
        <Select 
        styles={styles}
        options={options} 
        isSearchable={false}
        isMulti 
        value={queryoption}
        onChange={ (e,d) => handleChange(e,d,history, setSelectedOption,queryparsevar)
          // e => pushQuery(history,{country:e[1].value})
          // setSelectedOption      
        }
        menuIsOpen={true}
        hideSelectedOptions={false}
        components={{
          Control: () => null
        }}
        />
      </div>
      <div className={classes.Sm_Md}>
        MobileView
      </div>
    </div>
  </div>
  <div className={classes.Visualisation}>
    <div className={classes.KeyFigure__Md_Lg}>
      <div className={classes.KeyFiguresWrapper}>
          <Select 
          styles={styleVar}
          options={optionsvariable} 
          className={classes.KeyFigures}
          // // isMulti 
          value={queryoptionvar}
          onChange={ (e,d) => handleChangevar(e,d,history, setSelectedOptionvar,queryparse) }
          components={{
            // IndicatorSeparator: null,
            IndicatorsContainer: IndicatorsContainer
          }}
          />
      </div>
    </div>
    <div className={classes.LineGraph}>
    {renderLineChart}
    <TwitterShareButton
        url={"https://mkmdivy.github.io/pacdigitalstory/"+location.search}
        title={"The Economic Power of Africa's cities \n" + selectedOptionvar.value + ":" + queryparse.toString() + "\n" + "Explore more here:"}
        className="Demo__some-network__share-button">
        <TwitterIcon
          size={32}
          round />
      </TwitterShareButton>
      <FacebookShareButton
      url={"https://mkmdivy.github.io/pacdigitalstory/"+location.search}
      title="The Economic Power of Africa's cities"
      className="Demo__some-network__share-button">
      <FacebookIcon size={32} round />
      </FacebookShareButton>
      <button onClick={handleDownload}>
        {isLoading ? 'Downloading...' : 'Download Chart'}
      </button>
      <button >
      <a
          class='social-icon-link github'
          href="https://pac-app-int.oecd.org/story-builder/africa-urbanisation/en/index-v2?_storyblok=112743496&_storyblok_c=page&_storyblok_tk[space_id]=81332&_storyblok_tk[timestamp]=1646752082&_storyblok_tk[token]=0fc98df47cace759570fb3b892f350afb638a34f&_storyblok_version=&_storyblok_lang=default&_storyblok_release=0#policy-actions"
          target='_blank'
          rel="noopener"
          aria-label='Github'
        >        
          Explore the full story
      </a>
      </button>
    </div>
  </div>
</div>
  );
};

export default App;

function handleChange(e, d, history, setSelectedOption,queryparsevar) {
  if (e === null) {
    return;
  } else {
    setSelectedOption(e)
    const newCountries = e.map(d => d.value);       
    // pushQuery(history, { country: newCountries });
    history.push({
        pathname: history.pathname,
        search: queryString.stringify({country:newCountries,type:queryparsevar})  
    })
}
}


function handleChangevar(e, d, history, setSelectedOptionvar,queryparse) {
  if (e === null) {
    return;
  } else {
    setSelectedOptionvar(e)
    // pushQuery(history, { country: newCountries });
    history.push({
        pathname: history.pathname,
        search: queryString.stringify({country:queryparse,type:e.value})  
    })
}
}

// function pushQuery(history, incomingQuery){
  
//   const incomingQueryKey = Object.keys(incomingQuery)[0];
//   const prevQuery = queryString.parse(history.location.search, {
//     arrayFormat: "comma",
//     parseNumbers: true,
//   });

//   prevQuery[incomingQueryKey] = incomingQuery[incomingQueryKey];

//   const newQueries = queryString.stringify(prevQuery, {
//     skipEmptyString: true,
//     arrayFormat: "comma",
//     parseNumbers: true,
//   });

//   return history.push({
//   pathname: history.pathname,
//   search: `?${newQueries}`,
// })
// }
