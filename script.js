const newPartyForm = document.querySelector('#new-party-form');
const partyContainer = document.querySelector('#party-container');

const PARTIES_API_URL = 'http://fsa-async-await.herokuapp.com/api/workshop/parties';
const GUESTS_API_URL = 'http://fsa-async-await.herokuapp.com/api/workshop/guests';
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
  try {
    await fetch(`${PARTIES_API_URL}/${id}`, {
      method: 'DELETE',
    });
    const parties = await getAllParties();
    renderParties(parties);
  } catch (error) {
    console.error('Sorry');
  }
};

// render a single party by id
const renderSinglePartyById = async (id) => {
  try {
    const party = await getPartyById(id);

    const guestsResponse = await fetch(`${GUESTS_API_URL}/party/${id}`);
    const guests = await guestsResponse.json();

    const rsvpsResponse = await fetch(`${RSVPS_API_URL}/party/${id}`);
    const rsvps = await rsvpsResponse.json();

    const partyDetailsElement = document.createElement('div');
    partyDetailsElement.classList.add('party-details');
    partyDetailsElement.innerHTML = `
      <h2>${party.date}</h2>
      <p>${party.description}</p>
      <p>${party.location}</p>
      <p>${party.name}</p>
      <p>${party.time}</p>
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

      const detailsButton = partyElement.querySelector('.details-button');
      const detailsContainer = document.createElement('div');
      detailsContainer.classList.add('party-details');
      partyElement.appendChild(detailsContainer);

      detailsButton.addEventListener('click', async (evt) => {
        const partyId = evt.target.dataset.id;
        try {
          const response = await fetch(`${PARTIES_API_URL}/${partyId}`);
          const partyDetails = await response.json();

          detailsContainer.innerHTML = `
            <h2>${partyDetails.date}</h2>
            <p>${partyDetails.description}</p>
            <p>${partyDetails.location}</p>
            <p>${partyDetails.name}</p>
            <p>${partyDetails.time}</p>
            <button class="close-button">Close</button>
          `;

          const closeButton = detailsContainer.querySelector('.close-button');
          closeButton.addEventListener('click', () => {
            detailsContainer.innerHTML = '';
          });
        } catch (error) {
          console.error(error);
        }
      });

      const deleteButton = partyElement.querySelector('.delete-button');
      deleteButton.addEventListener('click', async (event) => {
        event.preventDefault();
        const partyId = event.target.dataset.id;
        await deleteParty(partyId);
      });
    });
  } catch (error) {
    console.error(error);
  }
};

// init function
const init = async () => {
  try {
    const parties = await getAllParties();
    renderParties(parties);
  } catch (error) {
    console.error(error);
  }
};

init();

