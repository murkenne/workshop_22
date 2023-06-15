const newPartyForm = document.querySelector('#new-party-form');
const partyContainer = document.querySelector('#party-container');
const PARTIES_API_URL =
  'http://fsa-async-await.herokuapp.com/api/workshop/parties';
const GUESTS_API_URL =
  'http://fsa-async-await.herokuapp.com/api/workshop/guests';
const RSVPS_API_URL = 'http://fsa-async-await.herokuapp.com/api/workshop/rsvps';
const GIFTS_API_URL = 'http://fsa-async-await.herokuapp.com/api/workshop/gifts';
// get all parties
const getAllParties = async () => {
  try {
    const response = await fetch(PARTIES_API_URL);
    const parties = await response.json();
    return parties;
  } catch (error) {
    console.error(error);
  }
};
// get single party by id
const getPartyById = async (id) => {
  try {
    const response = await fetch(`${PARTIES_API_URL}/${id}`);
    const party = await response.json();
    return party;
  } catch (error) {
    console.error(error);
  }
};
// delete party
const deleteParty = async (id) => {
  // your code here
  try {
    const response = await fetch(`${PARTIES_API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const party = await response.json();
    console.log(party);
    renderParties();
    window.location.reload();
  } catch (error) {
    console.log(error)
  }
};
// render a single party by id
const renderSinglePartyById = async (id) => {
  try {
    // fetch party details from server
    const party = await getPartyById(id);
    // GET - /api/workshop/guests/party/:partyId - get guests by party id
    const guestsResponse = await fetch(`${GUESTS_API_URL}/party/${id}`);
    const guests = await guestsResponse.json();
    // GET - /api/workshop/rsvps/party/:partyId - get RSVPs by partyId
    const rsvpsResponse = await fetch(`${RSVPS_API_URL}/party/${id}`);
    const rsvps = await rsvpsResponse.json();
    // GET - get all gifts by party id - /api/workshop/parties/gifts/:partyId -BUGGY?
    const giftsResponse = await fetch(`${GIFTS_API_URL}?party_id=${id}`);
    const gifts = await giftsResponse.json();
    // create new HTML element to display party details
    const partyDetailsElement = document.createElement('div');
    partyDetailsElement.classList.add('party-details');
    partyDetailsElement.innerHTML = `
            <h2>${party.name}</h2>
            <p>${party.date}</p>
            <p>${party.time}</p>
            <p>${party.location}</p>
            <p>${party.description}</p>
            <h3>Guests:</h3>
            <ul>
            ${guests
              .map(
                (guest, index) => `
              <li>
                <div>${guest.name}</div>
                <div>${rsvps[index].status}</div>
              </li>
            `
              )
              .join('')}
          </ul>
            <button class="close-button">Close</button>
        `;
    partyContainer.appendChild(partyDetailsElement);
    // add event listener to close button
    const closeButton = partyDetailsElement.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
      partyDetailsElement.remove();
    });
  } catch (error) {
    console.error(error);
  }
};
// render all parties
const renderParties = async (parties) => {
  try {
    partyContainer.innerHTML = '';
    parties.forEach((party) => {
      const partyElement = document.createElement('div');
      partyElement.classList.add('party');
      partyElement.innerHTML = `
                <h2>${party.name}</h2>
                <p>${party.description}</p>
                <p>${party.date}</p>
                <p>${party.time}</p>
                <p>${party.location}</p>
                <button class="details-button" data-id="${party.id}">See Details</button>
                <button class="delete-button" data-id="${party.id}">Delete</button>
            `;
      partyContainer.appendChild(partyElement);
      // see details
      const detailsButton = partyElement.querySelector('.details-button');
      detailsButton.addEventListener('click', async (event) => {
        // your code here
        // await renderSinglePartyById(party.id);
        //event.preventDefault();
       // const renderAllParties = await renderSinglePartyById(party.id)
        event.preventDefault();
        await renderSinglePartyById(party.id);
        console.log(party.id)
        partyContainer.innerHTML = `<h2>${party.name}</h2>
                <p>${party.description}</p>
                <p>${party.date}</p>
                <p>${party.time}</p>
                <p>${party.location}</p>
                <button class="details-button" data-id="${party.id}">See Details</button>
                <button class="delete-button" data-id="${party.id}">Delete</button>`
        const backButton = document.createElement('button');
        backButton.innerText = ``
        backButton.addEventListener('click', async (event) => {
          event.preventDefault()

          const parties = await getAllParties();
          renderParties(parties);
        })
        partyElement.appendChild(detailsButton)
      })
      
      // delete party
      let deleteButton = partyElement.querySelector('.delete-button');
      deleteButton.addEventListener('click', async (event) => {
        // your code here
        event.preventDefault();
        deleteParty(party.id)
      });
    });
  } catch (error) {
    console.error(error);
  }
};
// init function
const init = async () => {
  // your code here
  const parties = await getAllParties();
  renderParties(parties);
};
init();
