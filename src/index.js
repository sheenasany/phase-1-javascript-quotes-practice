// create a function to fetch all the quotes, iterate through data
//  and send it to the callback to display quotes
function getQuotes() {
    return fetch("http://localhost:3000/quotes?_embed=likes")
    .then(res => res.json())
    .then(quotes => quotes.forEach(quote => {
        displayQuotes(quote)
    })
    )
}

// call the function
getQuotes()

// quotes container
const quoteList = document.getElementById("quote-list")

// function that displays all the quotes
function displayQuotes(quote) {
        // console.log(quote)

        // create the quote card structure first
        // set up the quote card li
        const quoteCard = document.createElement("li")
        quoteCard.className = "quote-card"
        // console.log(quoteCard)

        // set up the blockquote and append to the quote card (later)
        const blockQuote = document.createElement("blockquote")
        blockQuote.className = "blockquote"
        
        // set up the p tag and add quote here
        const pTag = document.createElement("p")
        pTag.className = "mb-0"
        pTag.innerText = quote.quote

        // set up the footer tag and add the author
        const footer = document.createElement("footer")
        footer.className = "blockquote-footer"
        footer.innerText = quote.author

        // set up button and span tag and add span inside button 
        const addLikeBtn = document.createElement("button")
        addLikeBtn.className = "btn-success"
        addLikeBtn.id = quote.id
        addLikeBtn.textContent = "Likes: "
        const span = document.createElement("span")
        span.textContent = quote.likes.length
        // let int = document.createTextNode("0")
        // span.append(int)
        addLikeBtn.append(span)

        // add event listener to addQuoteBtn
        addLikeBtn.addEventListener("click", () => {
            newLikes(quote, span)
        })

        // set up delete button
        const deleteBtn = document.createElement("button")
        deleteBtn.className = "btn-danger"
        deleteBtn.innerText = "Delete"
        deleteBtn.addEventListener("click", () =>{
            deleteQuote(quote, quoteCard)
        })
        
        // append all inner elements to blockQuote
        blockQuote.append(pTag, footer, addLikeBtn, deleteBtn)
        // append blockQuote to quoteCard
        quoteCard.appendChild(blockQuote)
        // append quoteCare to quoteList
        quoteList.append(quoteCard)
}

// grab the form then add event listener with a callback
const form = document.getElementById('new-quote-form')
form.addEventListener('submit', (e) => {
    newQuote(e)
})

// handles new quote form submission
function newQuote(e){
    e.preventDefault()
    const quoteObj = {
        quote: e.target['new-quote'].value,
        author: e.target['author'].value,
        //must include likes key for like span
        likes: []
    }

    // post to quotes
    fetch("http://localhost:3000/quotes", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 
            'Accept': 'application/json'
        },
        body: JSON.stringify(quoteObj)
    })
    .then(res => res.json())
    //send to new quote to callback
    .then(newQuoteObj => displayQuotes(newQuoteObj))

    form.reset()

}

function deleteQuote(quote, quoteCard){
    fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method: 'DELETE'
    })
    quoteList.removeChild(quoteCard)
}

function newLikes(quote, span){
    fetch("http://localhost:3000/likes", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            quoteId: quote.id,
            date: Date.now()
        })
    })
    .then(res => res.json())
    .then(data => {
        span.textContent = parseInt(span.textContent, 10) + 1;
    })
}

// couldn't get this to work but leaving it here for now, don't need it anymore
// function displayLikes(likesArr) {
//     const newLikesCounted = {}
//     likesArr.forEach(like => {
//         newLikesCounted[like.quoteId] = (newLikesCounted[like.quoteId] || 0) + 1
//     })
//     console.log(newLikesCounted)
//     let likeCount = parseInt(e.target.lastChild.innerText) + 1
//     console.log(likeCount)
// }
