'use strict';

// Global variables
let votesAllowed = 25;
let previousImage = [];
// decrement in code to end voting round

// product storage
let allProducts = [];

// DOM Reference
let myContainer = document.getElementById('container');
let imgOne = document.getElementById('img-one');
let imgTwo = document.getElementById('img-two');
let imgThree = document.getElementById('img-three');
let resultsBtn = document.getElementById('show-results-btn');
let showResults = document.getElementById('display-results-list');

// Canvas Element for chart.js
let ctx = document.getElementById('my-chart');

// LOCAL STORAGE 2: ELECTRIC BOOGALOO

// Step 3: Getting it out of local storage
let retreivedProducts = localStorage.getItem('products');

console.log('retrieved products', retreivedProducts);

// Step 4: Parse data for code to be read

let parsedProducts = JSON.parse(retreivedProducts);

console.log('parsed products', parsedProducts);

// CONSTRUCTOR

function Products(name, fileExtension = 'jpg'){
  this.name = name;
  this.views = 0;
  this.clicks = 0;
  this.src = `img/${name}.${fileExtension}`;
  
  allProducts.push(this);
}

if(retreivedProducts){
  allProducts = parsedProducts;
} else {
  new Products('bag'); 
  new Products('banana');
  new Products('bathroom');
  new Products('boots');
  new Products('wine-glass');
  new Products('breakfast');
  new Products('bubblegum');
  new Products('chair');
  new Products('cthulhu') ;
  new Products('dog-duck');
  new Products('dragon');
  new Products('pen');
  new Products('pet-sweep');
  new Products('scissors');
  new Products('shark');
  new Products('sweep', 'png');
  new Products('tauntaun');
  new Products('unicorn');
  new Products('water-can');
}
console.log(allProducts);

// Executable Code

// make sure that these are randomized
// between 0 and the length-1
function getRandomIndex(){
  return Math.floor(Math.random()* allProducts.length);
}

let randomIndex = [];

// Image Rendering
function renderImgs(){
  // while(randomIndex.length < 3){
  //   let randoNum = getRandomIndex(); // 2 true
  //   while(!randomIndex.includes(randoNum)){
  //     // includes return a boolean
  //     randomIndex.push(randoNum);
  //     }
  // }
  
  // let productOneIndex = randomIndex.pop();
  // let productTwoIndex = randomIndex.pop();
  // let productThreeIndex = randomIndex.pop();

  let productOneIndex = getRandomIndex();
  let productTwoIndex = getRandomIndex();
  let productThreeIndex = getRandomIndex();


  // need validation to make sure they dont show up same round
  while(productOneIndex === productTwoIndex || productTwoIndex === productThreeIndex || productOneIndex === productThreeIndex || previousImage.includes(productOneIndex) || previousImage.includes(productTwoIndex) || previousImage.includes(productThreeIndex)){
    
    productOneIndex = getRandomIndex();
    productTwoIndex = getRandomIndex();
    productThreeIndex = getRandomIndex();
  }
 
  previousImage[0] = productOneIndex;
  previousImage[1] = productTwoIndex;
  previousImage[2] = productThreeIndex;

  imgOne.src = allProducts[productOneIndex].src;
  imgOne.alt = allProducts[productOneIndex].name;
  allProducts[productOneIndex].views++;

  imgTwo.src = allProducts[productTwoIndex].src;
  imgTwo.alt = allProducts[productTwoIndex].name;
  allProducts[productTwoIndex].views++;

  imgThree.src = allProducts[productThreeIndex].src;
  imgThree.alt = allProducts[productThreeIndex].name;
  allProducts[productThreeIndex].views++;
}

renderImgs();

// EVENT LISTNERS

// EVENT LISTENER #1 - CLICKS

// EVENT HANDLER - CALL BACK

function handleClick(e){
  votesAllowed--;

  let imgClicked = e.target.alt;

  for(let i = 0; i < allProducts.length; i++){
    if(imgClicked === allProducts[i].name){
      allProducts[i].clicks++;
    }
  }
  // Rerender new imgs
  renderImgs();
  
  // once voting completes - stop clicks
  if(votesAllowed === 0){
    myContainer.removeEventListener('click', handleClick);
    renderChart();

    // LOCAL STORAGE 1: WRITTEN BY JAMES GUNN

    // Step 1: Stringifying data
    let stringifiedProducts = JSON.stringify(allProducts);
    console.log('stringified products', stringifiedProducts);

    // step 2: Setting itme into local storage
    localStorage.setItem('products', stringifiedProducts);
  }
}

// EVENT #2 - Btn to show results - render list items

// function handleShowResults(e){
//   if(votesAllowed === 0){
//     for(let i = 0; i < allProducts.length; i++){
//       let li = document.createElement('li');
//       li.textContent = `${allProducts[i].name} was viewed ${allProducts[i].views} times, and was voted for ${allProducts[i].clicks} times.`;
//       showResults.appendChild(li);
//     }
//   }
// }

function renderChart() {

  // array to hold all goat names for labels on bottom of chart
  let productName = [];

  // data for each dataset
  let productClicks = [];
  let productViews = [];

  // for loop that will populate the above array dynamically
  for(let i = 0; i < allProducts.length; i++){
    productName.push(allProducts[i].name);
    productClicks.push(allProducts[i].clicks);
    productViews.push(allProducts[i].views);
  }


  let chartObject = {
    type: 'bar',
    data: {
      labels: productName,
      datasets: [{ // array of objects - each object is a bar on the chart
        label: '# of Clicks',
        data: productClicks,
        backgroundColor: [
          'red'
        ],
        borderColor: [
          'red'
        ],
        borderWidth: 1,
        hoverBorderColor: 'black'
      },
      {
        label: '# of Views',
        data: productViews,
        backgroundColor: [
          'blue'
        ],
        borderColor: [
          'blue'
        ],
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  const myChart = new Chart(ctx, chartObject);
}


// Grab what we want to listen to
myContainer.addEventListener('click', handleClick);

// resultsBtn.addEventListener('click', handleShowResults);
