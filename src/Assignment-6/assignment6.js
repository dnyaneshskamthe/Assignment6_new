const dom = (s) => document.querySelector(s);
const form = dom(".form");
const strCount = dom(".count");
const threadCount = dom(".threadCount");
const threadBox = dom(".thread-box");

// thread character limit
let size = 275; // for serial number & stuffs
let threadArr = [];


function textInfo(obj) {
    let length = obj.value.length;

    
    strCount.innerHTML = length;
    threadCount.innerHTML = Math.ceil(length / size);

    
    length > size
    ? (obj.style.color = "dodgerblue"): (obj.style.color = "seagreen");
}


function displayUI(listParent, arr = []) {
    listParent.innerHTML = arr
    .map((el, i) => {
        return `
        <article class="thread" data-index="${i}">

        <div class="tools">
        <span class="index">${i < 9 ? '0' + (i + 1): i + 1}</span>
        <span class="close" data-index="${i}">✖️</span>
        <span class="copy" data-index="${i}">📋</span>
        </div>

        <p class="thread_para">
        ${el}
        </p>

        </article>
        `;
    })
    .join("");
}

// Shorten the texts for threads
function threads(str) {

    // split the words based on space
    let splitOnWhiteSpace = str.split(' ');

    // result arr for storing final result
    let result = [];

    // vars for later measurement & values
    let totalLength = 0;
    let sentence = '';

    // loop through the words
    for (let i = 0; i < splitOnWhiteSpace.length; i++) {

        // get each word & it's length
        let curWord = splitOnWhiteSpace[i];
        let curWordLength = curWord.length;

        // build the sentence
        sentence += curWord + ' '; // the word & a space

        // +1 for the whiteSpace
        totalLength += curWordLength + 1;

        // check if the length crosses the limit
        if (totalLength >= size) {

            // trim the whiteSpace
            sentence = sentence.trim();

            // check if a word needs to be dropped
            let lengthDiff = sentence.length - size;

            if (lengthDiff > 0) {

                // find the last location where there is a whiteSpace
                let lastIndexOfWhiteSpace = sentence.lastIndexOf(' ');

                // only keep the part before that last whiteSpace
                sentence = sentence.slice(0, lastIndexOfWhiteSpace);

                // decrement the index because we still need to include the dropped word in the next sentence
                i--;
            }
            result.push(sentence);

            // reset everything
            totalLength = 0;
            sentence = '';
        }

       

        if (i === splitOnWhiteSpace.length -1 && totalLength <= size && sentence !== '') {
            result.push(sentence.trim());
        }
    }

    return result;

}


// Thread Maker here
function thread(e) {
    e.preventDefault();

    const thread = dom(".thread_para");
    //const txt = dom('.textarea').value;
    threadArr = threads(dom(".textarea").value);

    // Display on the UI
    displayUI(threadBox, threadArr);
}



// Events
form.addEventListener("submit", thread);


/////////////////////////////////////

function deleteThread(e) {
    const [el,
        index] = [e.target,
        e.target.dataset.index];
    let txt = e.target.dataset.para;
    //console.log(txt);

    
    if (el.classList.contains("close")) {
        // Remove the selected el
        threadArr.splice(index, 1);

        // update the UI
        displayUI(threadBox, threadArr);
    }

    
}

threadBox.addEventListener("click", deleteThread);