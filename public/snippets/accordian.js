
const accordionDef = ()=>{
    var acc = document.getElementsByClassName("accordion");
    var accPanel = document.getElementsByClassName("accordion-panel");
    for(let i=0 ; i<acc.length; i++ ){
        const toggle =()=>{
            console.log( accPanel[i].scrollHeight);
            if (accPanel[i].style.maxHeight) {
                accPanel[i].style.maxHeight ="0";
              } else {
            accPanel[i].style.maxHeight =  accPanel[i].scrollHeight + "px";
              }
        }
        acc[i].addEventListener("click", toggle)
    }
}


// Define the function you want to rerun
function onDomChange() {
    accordionDef();
    // Your code here
  }
  
  // Select the target node to observe (e.g., document.body for the whole document)
  const targetNode = document.body;
  
  // Set up the options for which types of mutations to observe
  const config = {
    childList: true, // Observes direct children changes
    subtree: true,   // Observes all descendants, not just direct children
    attributes: true // Observes attribute changes
 
};
  
  // Create an instance of MutationObserver and pass the callback function
  const observer = new MutationObserver((mutationsList, observer) => {
    // Trigger your function on each mutation
    onDomChange();
  });
  
  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
  
  // To stop observing, you can use:
  // observer.disconnect();
  