const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const {Op} = require("sequelize");
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

/**
 * FIX ME!
 * @returns contract by id
 */
app.get('/contracts/:id', getProfile, async (req, res) => {
  const {Contract} = req.app.get('models')
  const {id} = req.params
  const contract = await Contract.findOne({where: {id}})
  if (!contract) return res.status(404).end()
  if (contract.ContractorId !== req.profile.id)
    return res.status(404).end()
  res.json(contract)
});

app.get('/contracts', getProfile, async (req, res) => {
  const {Contract} = req.app.get('models');
  const contracts = await Contract.findAll({
    where: {
      [Op.and]: [{
        status: {
          [Op.ne]: 'terminated'
        }
      }, {
        [Op.or]: [{
          ContractorId: req.profile.id
        }, {
          ClientId: req.profile.id
        }]
      }]
    }
  })
  res.json(contracts)
});

app.get('/jobs/unpaid', getProfile, async (req, res) => {
  const {Job, Contract} = req.app.get('models');
  const profile = req.profile;
  const jobs = await Job.findAll({
    where: {
      paid: {
        [Op.not]: true
      }
    },
    include: {
      model: Contract,
      where: {
        [Op.and]: [
          {
            status: {
              [Op.ne]: 'terminated'
            }
          },
          {
            [Op.or]: [
              {ClientId: profile.id},
              {ContractorId: profile.id}],
          }
        ]
      }
    }
  })
  res.json(jobs);
});

app.post('/jobs/:job_id/pay', getProfile, async (req, res) => {
  const profile = req.profile;
  if (profile.type === 'contractor') {
    res.json({
      'msg': 'You are contractor'
    });
  } else {
    const {job_id} = req.params;
    const {Job, Contract, Profile} = req.app.get('models');
    const job = await Job.findOne({
      where: {
        id: job_id,
        paid: {
          [Op.not]: true
        }
      },
      include: {
        model: Contract,
        include: [{
          model: Profile,
          as: 'Contractor',
        },
          {
            model: Profile,
            as: 'Client',
          }],
        where: {
          ClientId: profile.id
        }
      }
    });
    if (job) {
      const client = job.Contract.Client;
      const contractor = job.Contract.Contractor;
      
      if (job.get('price') > client.get('balance')) {
        res.json({
          'msg': 'Your balance is not enough'
        });
      }
      let newBalance = client.get('balance') - job.get('price');
      await client.update({
        balance: newBalance
      });
      newBalance = contractor.get('balance') + job.get('price');
      await contractor.update({
        balance: newBalance
      });
      res.json({
        'msg': 'Successfully paid'
      });
    } else {
      res.json({
        'msg': 'No proper job'
      })
    }
  }
});

app.post('/balances/deposit/:userId', getProfile, async (req, res) => {
  const {userId} = req.params;
  const {Job, Contract, Profile} = req.app.get('models');
  const amount = req.get('amount');
  const job = await Job.findAll({
    where: {
      pa
    }
  });
});

app.get('/admin/best-profession', getProfile, async (req, res) => {
  // start, end are isoString
  // http://localhost:3001/admin/best-profession?start=2020-08-15T00:00:00.000Z&end=2020-08-25T00:00:00.000Z
  const {Job, Contract, Profile} = req.app.get('models');
  const job = await Job.findOne({
    where: {
      paymentDate: {
        [Op.between]: [req.query.start, req.query.end]
      },
      paid: true
    },
    include: {
      model: Contract,
      attributes: ['ContractorId'],
      include: {
        model: Profile,
        as: 'Contractor',
        attributes: ['profession']
      }
    },
    attributes: [
      [sequelize.fn('SUM', sequelize.col('Job.price')), 'paid_amount']
    ],
    group: 'Contract.Contractor.profession',
    order: [[sequelize.col('paid_amount'), "DESC"]],
  });
  if (job) {
    res.json({
      profession: job.Contract.Contractor.profession,
      paid_amount: job.get('paid_amount')
    });
  } else {
    res.json({
      profession: null
    });
  }
});

app.get('/admin/best-clients', getProfile, async (req, res) => {
// /admin/best-clients?start=<date>&end=<date>&limit=<integer>
  const {Job, Contract, Profile} = req.app.get('models');
  const limit = req.query.limit ? req.query.limit : 2;
  const job = await Job.findAll({
    where: {
      paymentDate: {
        [Op.between]: [req.query.start, req.query.end]
      },
      paid: true
    },
    include: {
      model: Contract,
      attributes: ['ClientId'],
      include: {
        model: Profile,
        as: 'Client',
        attributes: [
          'id',
          // [sequelize.fn('CONCAT', sequelize.col('firstName'), " ", sequelize.col('lastName')), 'fullName'],
          'firstName', 'lastName'
        ],
        where: {
          type: {
            [Op.eq]: 'client'
          }
        }
      }
    },
    attributes: [
      [sequelize.fn('SUM', sequelize.col('Job.price')), 'paid_amount']
    ],
    group: 'Contract.Client.firstName',
    order: [[sequelize.col('paid_amount'), "DESC"]],
    limit: limit,
  });
  if (job) {
    res.json(job);
  } else {
    res.json({});
  }
});
module.exports = app;
