const contract_id = {
  "id": 1,
  "terms": "bla bla bla",
  "status": "terminated",
  "createdAt": "2022-03-20T20:53:51.822Z",
  "updatedAt": "2022-03-20T20:53:51.822Z",
  "ContractorId": 5,
  "ClientId": 1
};

const contracts = [
  {
    id: 2,
    terms: 'bla bla bla',
    status: 'in_progress',
    createdAt: '2022-03-20T20:53:51.822Z',
    updatedAt: '2022-03-22T18:06:49.761Z',
    ContractorId: 6,
    ClientId: 1
  }
];

const jobs_unpaid = [
  {
    "id": 3,
    "description": "work",
    "price": 202,
    "paid": null,
    "paymentDate": null,
    "createdAt": "2022-03-20T20:53:51.823Z",
    "updatedAt": "2022-03-20T20:53:51.823Z",
    "ContractId": 3,
    "Contract": {
      "id": 3,
      "terms": "bla bla bla",
      "status": "in_progress",
      "createdAt": "2022-03-20T20:53:51.822Z",
      "updatedAt": "2022-03-20T20:53:51.822Z",
      "ContractorId": 6,
      "ClientId": 2
    }
  },
  {
    "id": 4,
    "description": "work",
    "price": 200,
    "paid": null,
    "paymentDate": null,
    "createdAt": "2022-03-20T20:53:51.823Z",
    "updatedAt": "2022-03-20T20:53:51.823Z",
    "ContractId": 4,
    "Contract": {
      "id": 4,
      "terms": "bla bla bla",
      "status": "in_progress",
      "createdAt": "2022-03-20T20:53:51.822Z",
      "updatedAt": "2022-03-20T20:53:51.822Z",
      "ContractorId": 7,
      "ClientId": 2
    }
  }
];

const best_profession = {
  "profession": "Programmer",
  "paid_amount": 2562
};

const best_clients = [
  {
    "paid_amount": 2020,
    "Contract": {
      "ClientId": 4,
      "Client": {
        "id": 4,
        "firstName": "Ash",
        "lastName": "Kethcum"
      }
    }
  },
  {
    "paid_amount": 421,
    "Contract": {
      "ClientId": 1,
      "Client": {
        "id": 1,
        "firstName": "Harry",
        "lastName": "Potter"
      }
    }
  }]

module.exports = {
  contract_id,
  contracts,
  jobs_unpaid,
  best_profession,
  best_clients
}