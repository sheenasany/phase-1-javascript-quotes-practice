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

// call the fetch function
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

        // set up the blockquote 
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

        // set up button 
        const addLikeBtn = document.createElement("button")
        addLikeBtn.className = "btn-success"
        addLikeBtn.id = quote.id
        addLikeBtn.textContent = "Likes: "

        // set up span tag and add span inside button 
        const span = document.createElement("span")
        span.textContent = quote.likes.length
        addLikeBtn.append(span)

        // add event listener to addQuoteBtn
        addLikeBtn.addEventListener("click", () => {
            newLikes(quote, span)
        })

        // set up delete button & add event listener
        const deleteBtn = document.createElement("button")
        deleteBtn.className = "btn-danger"
        deleteBtn.innerText = "Delete"
        deleteBtn.addEventListener("click", () =>{
            // send quote and quoteCard to callback
            deleteQuote(quote, quoteCard)
        })

        
        // set up edit button
        const editButton = document.createElement("button")
        editButton.className = "btn-info"
        editButton.innerText = "Edit"
        let editFormState = false
        editButton.addEventListener("click", () => {
            editFormState = !editFormState
            if (editFormState === true) {
                viewEditForm(quoteCard, quote)
            }
            else {
                hideEditForm(quoteCard)
            }
        })
        
        // append all inner elements to blockQuote
        blockQuote.append(pTag, footer, addLikeBtn, deleteBtn, editButton)
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

// use quote from displayQuote function to target id
// use quoteCard from displayQuote function to remove that particular quoteCard from quoteList
function deleteQuote(quote, quoteCard){
    fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method: 'DELETE'
    })
    quoteList.removeChild(quoteCard)
}

// take in quote and span from displayQuote func
// use quote's id for quoteId value
// use span to change content & update by adding 1 each time func is called in event listener
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

function viewEditForm(quoteCard, quote) {
    const editForm = document.createElement('form')
    const quoteDiv = document.createElement('div')
    quoteDiv.className = 'form-group'
    const authorDiv = document.createElement('div')
    authorDiv.className = 'form-group'
    
    const quoteInput = document.createElement('input')
    quoteInput.type = 'text'
    quoteInput.name = 'quote'
    quoteInput.value = quote.quote
    quoteInput.className = 'form-control'
    const label = document.createElement('label')
    label.textContent = "Edit Quote:"
    quoteDiv.append(label, quoteInput)

    const authorInput = document.createElement('input')
    authorInput.name = 'author'
    authorInput.type = 'text'
    authorInput.className = 'form-control'
    authorInput.value = quote.author
    const label2 = document.createElement('label')
    label2.textContent = "Edit Author:"
    authorDiv.append(label2, authorInput)

    const submitBtn = document.createElement('button')
    submitBtn.setAttribute('type', 'submit')
    submitBtn.setAttribute('value', 'submit')
    submitBtn.innerText = "Submit"

    editForm.addEventListener('submit', (e) => {
        submitEdit(e, quote, quoteCard, editForm)
    })

    editForm.append(quoteDiv, authorDiv, submitBtn)
    quoteCard.append(editForm)
    // console.log(editForm)
}

function submitEdit(e, quote, quoteCard) {
    e.preventDefault()
    // console.log(e.target[0].value)
    // console.log(quoteCard.firstChild.firstChild.textContent)
    // console.log(quoteCard.firstChild.children[1].textContent)

    fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'Application/json'
        },
        body: JSON.stringify({
            quote: e.target[0].value,
            author: e.target[1].value
        })
})
    .then(res => res.json())
    .then(newEdit => {
        quoteCard.firstChild.firstChild.textContent = newEdit.quote
        quoteCard.firstChild.children[1].textContent = newEdit.author
        viewEditForm(quoteCard, newEdit)
        hideEditForm(quoteCard)
    })
}

function hideEditForm(quoteCard) {
    console.log("I be hidden!")
    quoteCard.removeChild(quoteCard.lastElementChild)
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
