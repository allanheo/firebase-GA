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
let globalUserID = ''

// function renderRows(data) {
  
//   // Vanilla js way
//   let question = document.createElement('div');
//   question.innerHTML = `${data[0].text}`;
//   document.getElementById('question').appendChild(question);
 
// }

async function init() {

  let loginButton = document.getElementById('id-submit');
  let userID = document.getElementById('userid');

  loginButton.addEventListener('click', (event) => {
    event.preventDefault();
    // empty user ID
    if (userID.value === "") {
      document.getElementById("login-status").innerHTML = 'User ID cannot be empty'.fontcolor("red")
    } else {
      document.getElementById("login-status").innerHTML = 'Logged in as ' + userID.value.bold()
      globalUserID = userID.value
      //console.log(globalUserID)
    } 
  })

}


//------------------------------------------------------------------------------------
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


//------------------------------------------------------------------------------------
const render = async () => {
  const listContainer = document.getElementById('message-container');
  const messages = await getFanMessages();
  listContainer.innerHTML = '';

  messages.forEach((messageItem, i) => {
    listContainer.innerHTML += `
        <td>${messageItem.message}
        </td>
        <td>
          <i id="upvote${i}" class="material-icons upvote">thumb_up</i>
          <i id="downvote${i}" class="material-icons downvote">thumb_down</i>
          <i id="trash${i}" class="material-icons delete" data-id=${messageItem.id}>delete</i>      
        </td>
        <td>
          ${messageItem.upVotes}
        </td>
        <td>
          ${messageItem.owner}
        </td>
        `;
  });

  
  addDeleteListeners();
  addUpvoteListeners()
}
//------------------------------------------------------------------------------------
function deleteMessage(id) {
  // find message whose objectId is equal to the id we're searching with
  console.log(db.collection('messages').doc(id).owner)
  
  if (db.collection('messages').doc(id).owner === globalUserID) {
    return db.collection('messages').doc(id).delete();
  } else {
    document.getElementById("action-status").innerHTML = 'You can only delete your own messages'.fontcolor("red")
  }
}
//------------------------------------------------------------------------------------

function addDeleteListeners() {
  let deletes = document.querySelectorAll('.delete');
  for (let i = 0; i < deletes.length; i++) {
    deletes[i].addEventListener('click', async (e) => {
      await deleteMessage(e.target.dataset.id)
      render();
    });
  }
}

//------------------------------------------------------------------------------------
function upVoteMessage(id, userID) {
  // find message whose objectId is equal to the id we're searching with
  return db.collection('messages').doc(id).update({
    upVotes: firebase.firestore.Fieldvalue.arrayUnion('test')
  })
}
//------------------------------------------------------------------------------------

function addUpvoteListeners() {
  let upVoteButtons = document.querySelectorAll('.upvote');
  for (let i = 0; i < upVoteButtons.length; i++) {
    upVoteButtons[i].addEventListener('click', async (e) => {
      await upVoteMessage(e.target.dataset.id, globalUserID)
      render();
    });
  }
}

// //------------------------------------------------------------------------------------
// function deleteMessage(id) {
//   // find message whose objectId is equal to the id we're searching with
//   return db.collection('messages').doc(id).delete();
// }
// //------------------------------------------------------------------------------------

// function addDeleteListeners() {
//   let deletes = document.querySelectorAll('.delete');
//   for (let i = 0; i < deletes.length; i++) {
//     deletes[i].addEventListener('click', async (e) => {
//       await deleteMessage(e.target.dataset.id)
//       render();
//     });
//   }
// }


//------------------------------------------------------------------------------------
const onLoadHandler = async () => {

  // getFanMessages();

  // click listener for submission
  document.getElementById('answer-form').addEventListener('submit', (event) => {
    // by default a form submit reloads the DOM which will subsequently reload all our JS
    // to avoid this we preventDefault()
    event.preventDefault();

    const messageInput = document.getElementById('newmessage');
    if (globalUserID === '') {
      document.getElementById("answer-status").innerHTML = 'Must set User ID first'.fontcolor("red")
    }

    else if (messageInput.value === '') {
      document.getElementById("answer-status").innerHTML = 'You cannot submit a blank answer'.fontcolor("red")
    }

    else {

      db.collection("messages").add(
        {
          message: messageInput.value,
          upVotes: [],
          downVotes: [],
          owner: globalUserID
        }
      ).then(() => {
        messageInput.value = '';
      });

      // this render after submit
      render();
    }    
  });
  


  // On first load
  render();
  addDeleteListeners();
  addUpvoteListeners()
  init()
  

};
//------------------------------------------------------------------------------------
// Wait for DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onLoadHandler);
} else {
  onLoadHandler();
}
