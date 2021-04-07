// import { firebaseConfig } from './keys.js';
const firebaseConfig = {
  apiKey: "AIzaSyCHooEFfeZIDVMEFFpC3dUaJBXd7OUrMeg",
  authDomain: "final-project-ga-11caf.firebaseapp.com",
  projectId: "final-project-ga-11caf",
  storageBucket: "final-project-ga-11caf.appspot.com",
  messagingSenderId: "1009678257464",
  appId: "1:1009678257464:web:5829e82a7d4a548542c5cd",
  measurementId: "G-2J3HBN3XR6"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();


// function renderRows(data) {
  
//   // Vanilla js way
//   let question = document.createElement('div');
//   question.innerHTML = `${data[0].text}`;
//   document.getElementById('question').appendChild(question);
 
// }

async function init(url) {
  
}

const getFanMessages = async () => {
  const data = await db.collection('messages').get();

  // transform to a more useful format
  // const messages = data.docs.map((doc) => {
  //   // console.log('doc.data()', doc.data());
  //   // below combines the document id with all properties returned by doc.data()
  //   return {
  //     id: doc.id,
  //     ...doc.data()
  //   };
  // });
  
  const messages = [];
  data.docs.forEach(doc => {
    messages.push({
      id: doc.id,
      ...doc.data()
    })
  });
  // console.log('messages', messages);
  return messages;
};

const render = async () => {
  const listContainer = document.getElementById('message-container');
  const messages = await getFanMessages();
  listContainer.innerHTML = '';

  messages.forEach((messageItem, i) => {
    listContainer.innerHTML += `<td>${messageItem.message}</td>
        <td>
          <i class="material-icons upvote">thumb_up</i>
          <i class="material-icons downvote">thumb_down</i>
          <i id="trash${i}" class="material-icons delete" data-id=${messageItem.id}>delete</i>      
        </td>`;
  });

  
  addDeleteListeners();
}

function deleteMessage(id) {
  // find message whose objectId is equal to the id we're searching with
  return db.collection('messages').doc(id).delete();
}

function addDeleteListeners() {
  let deletes = document.querySelectorAll('.delete');
  for (let i = 0; i < deletes.length; i++) {
    deletes[i].addEventListener('click', async (e) => {
      await deleteMessage(e.target.dataset.id)
      render();
    });
  }
}

const onLoadHandler = async () => {

  // getFanMessages();

  // click listener for submission
  document.getElementById('answer-form').addEventListener('submit', (event) => {
    // by default a form submit reloads the DOM which will subsequently reload all our JS
    // to avoid this we preventDefault()
    event.preventDefault();

    const messageInput = document.getElementById('newmessage');

    db.collection("messages").add(
      {
        message: messageInput.value,
        votes: 0
      }
    ).then(() => {
      messageInput.value = '';
    });

    // this render after submit
    render();

  });
  


  // On first load
  render();
  addDeleteListeners();
  init(math_url)
  

};

// Wait for DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onLoadHandler);
} else {
  onLoadHandler();
}

