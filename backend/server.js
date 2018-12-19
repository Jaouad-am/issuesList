import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import Issue from './models/issue';

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/issues');
// let issue = new Issue({title:'hala', responsible: 'wtf', description: 'wtf' });
// issue.save();
const connection = mongoose.connection;

connection.once('open', () => {
    console.log('connected to Mongodb Database Successfully.')
});

router.route('/issues').get((req, res) => {
    Issue.find((err, issues) => {
        if(err)
            console.log(err);
        else
            res.json(issues);
    });
});

router.route('/issues/:id').get((req, res) => {
    Issue.findById(req.params.id, (err, issue) => {
        if(err)
            console.log(err);
        else   
            res.json(issue);
    });
});

router.route('/issues/add').post((req, res) => {
    let issue = new Issue(req.body);
    issue.save()
        .then(issue => {
        res.status(200).json({'issue': 'Added Successfully'});
    })
        .catch(err => {
            res.status(400).send('failed to create new record');
        })
});

router.route('/issues/update/:id').post((req, res) => {
    Issue.findById(req.params.id, (err, issue) => {
        if(!issue)
            return next(new Error('Could not load Document!'));
        else{
            
        
            issue.title = req.body.title;
            issue.responsible = req.body.responsible;
            issue.description = req.body.description;
            issue.severity = req.body.severity;
            issue.status = req.body.status;

            issue.save().then(issue => {
                res.json('updated!');
            }).catch(err => {
                res.status(400).send('update failed!');
            });
        }
    });
});

router.route('/issue/delete/:id').get((req, res) => {
    Issue.findByIdAndRemove({_id: req.params.id}, (err, issue) => {
        if(err)
            res.json(err);
        else
            res.json('removed Successfully!!');
    });
});

app.use('/', router);   

app.listen(3000, () => console.log('express server running on port 3000'));