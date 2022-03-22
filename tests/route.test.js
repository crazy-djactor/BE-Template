const app = require('../src/app');
const request = require('supertest');
const {contracts, jobs_unpaid, best_profession, best_clients} = require("./mock-data");


describe('contracts ', () => {
  it('/contracts/:id', async () => {
    const res = await request(app).get('/contracts/1')
      .set('profile_id', 5);
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('ContractorId', 5)
  })
  
  it('/contracts', async () => {
    const res = await request(app).get('/contracts')
      .set('profile_id', 1);
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveLength(1)
    expect(res.body).toEqual(contracts)
  })
})

describe('jobs', () => {
  it('/jobs/unpaid', async () => {
    const res = await request(app).get('/jobs/unpaid')
      .set('profile_id', 2);
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveLength(2)
    expect(res.body).toEqual(jobs_unpaid)
  })
})

describe('best profession', () => {
  it('/admin/best-profession', async () => {
    const res = await request(app).get('/admin/best-profession')
      .query({start: '2020-08-15T00:00:00.000Z', end: '2020-08-25T00:00:00.000Z'})
      .set('profile_id', 1);
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(best_profession)
  })
})

describe('best-client', () => {
  it('/admin/best-clients', async () => {
    const res = await request(app).get('/admin/best-clients')
      .query({start: '2020-08-15T00:00:00.000Z', end: '2020-08-25T00:00:00.000Z', limit: 2})
      .set('profile_id', 1);
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveLength(2)
    expect(res.body).toEqual(best_clients)
  })
})