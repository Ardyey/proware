const express = require("express");
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');
const path = require('path');
const ejs = require('ejs');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const proxy = require('http-proxy-middleware');
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const logDir = 'log';
const port = 3000;

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: `${logDir}/%DATE%-results.log`,
  datePattern: 'YYYY-MM-DD'
});

const logger = createLogger({
  // change level if in dev environment versus production
  level: 'verbose',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console({
      level: 'info',
      format: format.combine(
        format.colorize(),
        format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    }),
    dailyRotateFileTransport
  ]
});

const signin = require('./controllers/signin');
const signup = require('./controllers/signup');

const home = require('./controllers/dashboard/dashboard');

const m_user = require('./controllers/maintenance/user/user');
const addUser = require('./controllers/maintenance/user/addUser');
const editUser = require('./controllers/maintenance/user/editUser');
const deleteUser = require('./controllers/maintenance/user/deleteUser');

const m_product = require('./controllers/maintenance/product/product');
const addProduct = require('./controllers/maintenance/product/addProduct');
const editProduct = require('./controllers/maintenance/product/editProduct');
const deleteProduct = require('./controllers/maintenance/product/deleteProduct');

const m_category = require('./controllers/maintenance/category/category');
const addCategory = require('./controllers/maintenance/category/addCategory');
const editCategory = require('./controllers/maintenance/category/editCategory');
const deleteCategory = require('./controllers/maintenance/category/deleteCategory');

const m_product_course = require('./controllers/maintenance/product_course/product_course');
const addProdCourse = require('./controllers/maintenance/product_course/addProdCourse');
const editProdCourse = require('./controllers/maintenance/product_course/editProdCourse');
const deleteProdCourse = require('./controllers/maintenance/product_course/deleteProdCourse');


const m_shs = require('./controllers/maintenance/student/shs');
const addSHS = require('./controllers/maintenance/student/shs_add');
const editSHS = require('./controllers/maintenance/student/shs_edit');
const deleteSHS = require('./controllers/maintenance/student/shs_delete');

const m_tertiary = require('./controllers/maintenance/student/tertiary');
const addTertiary = require('./controllers/maintenance/student/tertiary_add');
const editTertiary = require('./controllers/maintenance/student/tertiary_edit');
const deleteTertiary = require('./controllers/maintenance/student/tertiary_delete');

const m_course_strand = require('./controllers/maintenance/course_strand/course_strand');
const addCourse = require('./controllers/maintenance/course_strand/addCourse');
const editCourse = require('./controllers/maintenance/course_strand/editCourse');
const deleteCourse = require('./controllers/maintenance/course_strand/deleteCourse');

const mon_update = require('./controllers/monitoring/updateOrder');
const mon_pending = require('./controllers/monitoring/pending');
const mon_approved = require('./controllers/monitoring/approved');
const mon_cancelled = require('./controllers/monitoring/cancelled');
const mon_paid = require('./controllers/monitoring/paid');
const mon_success = require('./controllers/monitoring/success');
const mon_returned = require('./controllers/monitoring/returned');
const mon_expired = require('./controllers/monitoring/expired');
const mon_view = require('./controllers/monitoring/view');

const exch_update = require('./controllers/exch_monitoring/updateOrder');
const exch_pending = require('./controllers/exch_monitoring/pending');
const exch_paid = require('./controllers/exch_monitoring/paid');
const exch_success = require('./controllers/exch_monitoring/success');

const rsales = require('./controllers/report/sales');
const rinventory = require('./controllers/report/inventory');
const rcancelled = require('./controllers/report/cancelled');
const rreturned = require('./controllers/report/returned');
const rexchange = require('./controllers/report/exchange');

const log_maintenance = require('./controllers/activity/log_maintenance');
const log_monitoring = require('./controllers/activity/log_monitoring');

const resetPassword = require('./controllers/reset');

const searchOrders = require('./controllers/search_orders');

const ret = require('./controllers/ret/return');
const exch = require('./controllers/ret/exchange');

const { routes } = require('./config.json');

//Change this on deployment
const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '1234',
    database : 'proware_db'
  }
});


//Change this on deployment
app.use(session({
  name: 'back_session',
	secret: 'back_secret',
	resave: false,
	saveUninitialized: false
}));

//http proxy middleware options
// for (route of routes) {
//     app.use(route.route,
//         proxy({
//             target: route.address,
//             pathRewrite: (path, req) => {
//                 return path.split('/').slice(2).join('/'); 
//             }
//         })
//     );
// }

const checkSignIn = (req, res, next) => {
   if(req.session.user){
        next();     //If session exists, proceed to page
     } else {
        res.render('pages/error-404') //Error, trying to access unauthorized page!
     }
}

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cors());

app.set('view engine', 'ejs');
app.use('/proware', express.static(__dirname + '/node_modules'));
app.use('/proware', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

const imagePath = './public/images/product/';

const storage = multer.diskStorage({
    destination: './public/images/product/',
    filename:(req, file, cb) => {
      cb( null, file.originalname );
    }
});

const upload = multer({ storage })

app.get('/', (req, res) => res.redirect('/proware'));

app.get('/proware', (req, res) => res.render('pages/back/login'));

app.get('/proware/dashboard', checkSignIn, (req, res) => {
  res.render('pages/back/home', { 
    id: req.session.user.id,
    position: req.session.position
  });
});

app.get('/proware/prod_book', checkSignIn, (req, res) => home.bookList(req, res, db, logger));
app.get('/proware/book_search', checkSignIn, (req, res) => home.searchBook(req, res, db, logger));

app.get('/proware/prod_proware', checkSignIn, (req, res) => home.prowareList(req, res, db, logger));
app.get('/proware/proware_search', checkSignIn, (req, res) => home.searchProware(req, res, db, logger));

app.get('/proware/prod_uniform', checkSignIn, (req, res) => home.uniformList(req, res, db, logger));
app.get('/proware/uniform_search', checkSignIn, (req, res) => home.searchUniform(req, res, db, logger));

app.get('/proware/user_maintenance', checkSignIn, (req, res) => {
  res.render('pages/back/maintenance/user_maintenance', { 
    id: req.session.user.id,
    position: req.session.position
    })
})

app.get('/proware/tertiary_maintenance', checkSignIn, (req, res) => {
  res.render('pages/back/maintenance/tertiary_maintenance', { 
    id: req.session.user.id,
    position: req.session.position
    })
})

app.get('/proware/SHS_maintenance', checkSignIn, (req, res) => {
  res.render('pages/back/maintenance/SHS_maintenance', { 
    id: req.session.user.id,
    position: req.session.position
    })
})

app.get('/proware/product_maintenance', checkSignIn, (req, res) => {
  res.render('pages/back/maintenance/product_maintenance', { 
    id: req.session.user.id,
    position: req.session.position
    })
})

app.get('/proware/update_status', checkSignIn, (req, res) => {
  res.render('pages/back/maintenance/update_status', { 
    id: req.session.user.id,
    position: req.session.position
    })
})

app.get('/proware/category_maintenance', checkSignIn, (req, res) => {
  res.render('pages/back/maintenance/category_maintenance', { 
    id: req.session.user.id,
    position: req.session.position
    })
})

app.get('/proware/product_course_maintenance', checkSignIn, (req, res) => {
  res.render('pages/back/maintenance/product_course_maintenance', { 
    id: req.session.user.id,
    position: req.session.position
    })
})

app.get('/proware/course_strand_maintenance', checkSignIn, (req, res) => {
  res.render('pages/back/maintenance/course_strand', { 
    id: req.session.user.id,
    position: req.session.position
    })
})

app.get('/proware/monitor_pending', checkSignIn, (req, res) => {
  res.render('pages/back/monitoring/pending', { 
    id: req.session.user.id,
    position: req.session.position
    })
})

app.get('/proware/monitor_approved', checkSignIn, (req, res) => {
  res.render('pages/back/monitoring/approved', { 
    id: req.session.user.id,
    position: req.session.position
    })
})

app.get('/proware/monitor_cancelled', checkSignIn, (req, res) => {
  res.render('pages/back/monitoring/cancelled', { 
    id: req.session.user.id,
    position: req.session.position
    })
})

app.get('/proware/monitor_paid', checkSignIn, (req, res) => {
  res.render('pages/back/monitoring/paid', { 
    id: req.session.user.id,
    position: req.session.position
    })
})

app.get('/proware/monitor_success', checkSignIn, (req, res) => {
  res.render('pages/back/monitoring/success', { 
    id: req.session.user.id,
    position: req.session.position
    })
})

app.get('/proware/monitor_returns', checkSignIn, (req, res) => {
  res.render('pages/back/monitoring/returns', { 
    id: req.session.user.id,
    position: req.session.position
    })
})

app.get('/proware/monitor_expired', checkSignIn, (req, res) => {
  res.render('pages/back/monitoring/expired', { 
    id: req.session.user.id,
    position: req.session.position
    })
})

app.get('/proware/monitor_view', checkSignIn, (req, res) => {
  res.render('pages/back/monitoring/view', { 
    id: req.session.user.id,
    position: req.session.position
    })
})

app.get('/proware/report_sales', checkSignIn, (req, res) => {
  res.render('pages/back/report/sales', { 
    id: req.session.user.id,
    position: req.session.position
    })
})

app.get('/proware/report_inventory', checkSignIn, (req, res) => {
  res.render('pages/back/report/inventory', { 
    id: req.session.user.id,
    position: req.session.position
    })
})

app.get('/proware/report_cancelled', checkSignIn, (req, res) => {
  res.render('pages/back/report/cancelled', { 
    id: req.session.user.id,
    position: req.session.position
    })
})

app.get('/proware/report_returned', checkSignIn, (req, res) => {
  res.render('pages/back/report/returned', { 
    id: req.session.user.id,
    position: req.session.position
    })
})

app.get('/proware/report_exchanged', checkSignIn, (req, res) => {
  res.render('pages/back/report/exchanged', { 
    id: req.session.user.id,
    position: req.session.position
    })
})

app.get('/proware/log_maintenance', checkSignIn, (req, res) => {
  res.render('pages/back/activity/maintenance', { 
    id: req.session.user.id,
    position: req.session.position
    })
})

app.get('/proware/log_monitoring', checkSignIn, (req, res) => {
  res.render('pages/back/activity/monitoring', { 
    id: req.session.user.id,
    position: req.session.position
    })
})

app.get('/proware/reset_password', checkSignIn, (req, res) => {
  res.render('pages/back/reset', { 
    id: req.session.user.id,
    position: req.session.position
    });
});

app.get('/proware/search_orders', checkSignIn, (req, res) => {
  res.render('pages/back/search_orders', { 
    id: req.session.user.id,
    position: req.session.position
    });
});

app.get('/proware/return_item', checkSignIn, (req, res) => {
  res.render('pages/back/ret/return_item', { 
    id: req.session.user.id,
    position: req.session.position
    });
});

app.get('/proware/process_return', checkSignIn, (req, res) => {
  res.render('pages/back/ret/process_return', { 
    id: req.session.user.id,
    position: req.session.position
    });
});

app.get('/proware/exchange_item', checkSignIn, (req, res) => {
  res.render('pages/back/ret/exchange_item', { 
    id: req.session.user.id,
    position: req.session.position
    });
});

app.get('/proware/process_exchange', checkSignIn, (req, res) => {
  res.render('pages/back/ret/process_exchange', { 
    id: req.session.user.id,
    position: req.session.position
    });
});

app.get('/proware/exchange_pending', checkSignIn, (req, res) => {
  res.render('pages/back/exch_monitoring/exchange_pending', { 
    id: req.session.user.id,
    position: req.session.position
    })
});

app.get('/proware/exchange_paid', checkSignIn, (req, res) => {
  res.render('pages/back/exch_monitoring/exchange_paid', { 
    id: req.session.user.id,
    position: req.session.position
    })
});

app.get('/proware/exchange_success', checkSignIn, (req, res) => {
  res.render('pages/back/exch_monitoring/exchange_success', { 
    id: req.session.user.id,
    position: req.session.position
    })
});

app.post('/proware/auth', (req, res) => signin.handleSignin(req, res, db, logger, bcrypt));

app.get('/proware/signout', (req, res) => {
    req.session.destroy(function(){
      console.log("user logged out.")
   });
   res.redirect('/proware');
});

app.get('/proware/signup', (req, res) => signup.initializeFields(req, res, db, logger));
app.get('/proware/admin_signup', checkSignIn, (req, res) => signup.superInitializeFields(req, res, db, logger));
app.post('/proware/register', (req, res) => signup.handleSignup(req, res, db, logger, bcrypt));

app.get('/proware/curuser', (req, res) => {
  db.select('first_name', 'last_name').from('user').where('username', '=', req.session.user)
  .then(data => {
    res.json(data)
  })
  .catch(err => res.status(400).send('DB Connection failed!'))
})

//REMEMBER TO ADD CHECKSIGNIN AT THE END OF DEVELOPMENT!!!

//user maintenance
app.get('/proware/m_user.json', checkSignIn, (req, res) => m_user.getpopulateTable(req, res, db, logger));
app.get('/proware/m_user_pos.json', checkSignIn, (req, res) => m_user.getPositions(req, res, db, logger));
app.post('/proware/m_adduser', checkSignIn, (req, res) => addUser.dbAddUser(req, res, db, logger, bcrypt));
app.post('/proware/m_edituser', checkSignIn, (req, res) => editUser.dbEditUser(req, res, db, logger));
app.delete('/proware/m_deleteuser', checkSignIn, (req, res) => deleteUser.dbDeleteUser(req, res, db, logger));

//product maintenance
app.get('/proware/m_product.json', checkSignIn, (req, res) => m_product.prodPopulateTable(req, res, db, logger));
app.get('/proware/m_product_type.json', checkSignIn, (req, res) => m_product.getCategory(req, res, db, logger));
app.post('/proware/m_aupload',upload.single('addProdImage'), (req, res) => {
  console.log("File uploaded!");
  res.json({
    isSuccess: true
  });
});
app.post('/proware/m_addproduct', checkSignIn, (req, res) => addProduct.dbAddProduct(req, res, db, logger));
app.post('/proware/m_editproduct', checkSignIn, (req, res) => editProduct.dbEditProduct(req, res, db, logger, fs, imagePath));
app.post('/proware/m_updatestatus', checkSignIn, (req, res) => m_product.updateStatus(req, res, db, logger));
app.post('/proware/m_eupload', upload.single('editProdImage'), (req, res) => {
  console.log("File uploaded!");
  res.json({
    isSuccess: true
  });
});
app.delete('/proware/m_deleteproduct', checkSignIn, (req, res) => deleteProduct.dbDeleteProduct(req, res, db, logger, fs, imagePath));

//category maintenance
app.get('/proware/m_category.json', checkSignIn, (req, res) => m_category.catPopulateTable(req, res, db, logger));
app.post('/proware/m_addcat', checkSignIn, (req, res) => addCategory.dbAddCategory(req, res, db, logger));
app.post('/proware/m_editcat', checkSignIn, (req, res) => editCategory.dbEditCategory(req, res, db, logger));
app.delete('/proware/m_deletecat', checkSignIn, (req, res) => deleteCategory.dbDeleteCategory(req, res, db, logger));

//product course maintenance
app.get('/proware/m_prod_course.json', checkSignIn, (req, res) => m_product_course.pcPopulateTable(req, res, db, logger));
app.post('/proware/m_addcourse', checkSignIn, (req, res) => addProdCourse.dbAddProdCourse(req, res, db, logger));
app.post('/proware/m_editcourse', checkSignIn, (req, res) => editProdCourse.dbEditProdCourse(req, res, db, logger));
app.delete('/proware/m_deletecourse', checkSignIn, (req, res) => deleteProdCourse.dbDeleteProdCourse(req, res, db, logger));

//shs student maintenance
app.get('/proware/m_shs.json', checkSignIn, (req, res) => m_shs.shsPopulateTable(req, res, db, logger));
app.get('/proware/m_strand.json', checkSignIn, (req, res) => m_shs.getStrand(req, res, db, logger));
app.post('/proware/m_addshs', checkSignIn, (req, res) => addSHS.dbAddSHS(req, res, db, logger));
app.post('/proware/m_editshs', checkSignIn, (req, res) => editSHS.dbEditSHS(req, res, db, logger));
app.delete('/proware/m_deleteshs', checkSignIn, (req, res) => deleteSHS.dbDeleteSHS(req, res, db, logger));

//tertiary student maintenance
app.get('/proware/m_tertiary.json', checkSignIn, (req, res) => m_tertiary.tertiaryPopulateTable(req, res, db, logger));
app.get('/proware/m_course.json', checkSignIn, (req, res) => m_tertiary.getCourse(req, res, db, logger));
app.post('/proware/m_addtertiary', checkSignIn, (req, res) => addTertiary.dbAddTertiary(req, res, db, logger));
app.post('/proware/m_edittertiary', checkSignIn, (req, res) => editTertiary.dbEditTertiary(req, res, db, logger));
app.delete('/proware/m_deletetertiary', checkSignIn, (req, res) => deleteTertiary.dbDeleteTertiary(req, res, db, logger));

//course strand maintenance
app.get('/proware/m_course_strand.json', checkSignIn, (req, res) => m_course_strand.PopulateTable(req, res, db, logger));
app.post('/proware/m_addcourse_strand', checkSignIn, (req, res) => addCourse.dbAddCourse(req, res, db, logger));
app.post('/proware/m_editcourse_strand', checkSignIn, (req, res) => editCourse.dbEditCourse(req, res, db, logger));
app.delete('/proware/m_deletecourse_strand', checkSignIn, (req, res) => deleteCourse.dbDeleteCourse(req, res, db, logger));

//MONITORING

//Pending
app.get('/proware/mon_pending.json', checkSignIn, (req, res) => mon_pending.mpendPopulateTable(req, res, db, logger));
//Approved
app.get('/proware/mon_approved.json', checkSignIn, (req, res) => mon_approved.mapprPopulateTable(req, res, db, logger));
//Cancelled
app.get('/proware/mon_cancelled.json', checkSignIn, (req, res) => mon_cancelled.mcancelPopulateTable(req, res, db, logger));
//Paid
app.get('/proware/mon_paid.json', checkSignIn, (req, res) => mon_paid.mpaidPopulateTable(req, res, db, logger));
//Paid
app.get('/proware/mon_success.json', checkSignIn, (req, res) => mon_success.msuccessPopulateTable(req, res, db, logger));
//Return
app.get('/proware/mon_returned.json', checkSignIn, (req, res) => mon_returned.mreturnPopulateTable(req, res, db, logger));
//Expired
app.get('/proware/mon_expired.json', checkSignIn, (req, res) => mon_expired.mexpPopulateTable(req, res, db, logger));
//Update Order
app.post('/proware/mon_update', checkSignIn, (req, res) => mon_update.updateOrder(req, res, db, logger));
//View Items
app.get('/proware/mon_view.json', checkSignIn, (req, res) => mon_view.viewTrxItems(req, res, db, logger));

//REPORTS

//Sales
app.get('/proware/rsales.json', checkSignIn, (req, res) => rsales.rsalesPopulateTable(req, res, db, logger));
//Inventory
app.get('/proware/moving.json', checkSignIn, (req, res) => rinventory.movingPopulateTable(req, res, db, logger));
app.get('/proware/non-moving.json', checkSignIn, (req, res) => rinventory.nmovingPopulateTable(req, res, db, logger));
//Cancelled
app.get('/proware/rcancelled.json', checkSignIn, (req, res) => rcancelled.rcancelledPopulateTable(req, res, db, logger));
app.get('/proware/rcancelled_item.json', checkSignIn, (req, res) => rcancelled.rcancelledItemPopulateTable(req, res, db, logger));
//Returned
app.get('/proware/rreturned.json', checkSignIn, (req, res) => rreturned.rreturnedPopulateTable(req, res, db, logger));
app.get('/proware/rreturned_item.json', checkSignIn, (req, res) => rreturned.rreturnedItemPopulateTable(req, res, db, logger));
//Exchanged
app.get('/proware/rexchanged_item.json', checkSignIn, (req, res) => rexchange.exchangePopulateTable(req, res, db, logger));

//ACTIVITY LOGS

//Maintenance
app.get('/proware/log_maintenance.json', checkSignIn, (req, res) => log_maintenance.logMaintenancePopulateTable(req, res, db, logger));
//Monitoring
app.get('/proware/log_monitoring.json', checkSignIn, (req, res) => log_monitoring.logMonitoringPopulateTable(req, res, db, logger));

//RESET PASSWORD
app.get('/proware/r_user.json', checkSignIn, (req, res) => resetPassword.populateTable(req, res, db, logger));
app.post('/proware/reset_pass', checkSignIn, (req, res) => resetPassword.resetPassword(req, res, db, logger, bcrypt));

//SEARCH ORDERS
app.get('/proware/search_orders.json', checkSignIn, (req, res) => searchOrders.populateTable(req, res, db, logger));

//RETURN / EXCHANGE ITEM
//Return
app.get('/proware/return_item.json', checkSignIn, (req, res) => ret.populateTable(req, res, db, logger));
app.get('/proware/process_return.json', checkSignIn, (req, res) => ret.retPopulateTable(req, res, db, logger));
app.post('/proware/item_return', checkSignIn, (req, res) => ret.returnItem(req, res, db, logger));
//Exchange
app.get('/proware/exchange_item.json', checkSignIn, (req, res) => exch.populateTable(req, res, db, logger));
app.get('/proware/process_exchange.json', checkSignIn, (req, res) => exch.exchPopulateTable(req, res, db, logger));
app.post('/proware/exchange_item_list', checkSignIn, (req, res) => exch.submitItem(req, res, db, logger));
app.post('/proware/exchange_submit', checkSignIn, (req, res) => exch.submitValue(req, res, db, logger));
//Exchange monitoring

//Update Order
app.post('/proware/exch_update', checkSignIn, (req, res) => exch_update.updateOrder(req, res, db, logger));

//Pending
app.get('/proware/exch_pending.json', checkSignIn, (req, res) => exch_pending.ePendPopulateTable(req, res, db, logger));
//Paid
app.get('/proware/exch_paid.json', checkSignIn, (req, res) => exch_paid.ePaidPopulateTable(req, res, db, logger));
//Success
app.get('/proware/exch_success.json', checkSignIn, (req, res) => exch_success.eSuccessPopulateTable(req, res, db, logger));



let { pCount, oCount, bCount, prCount, uCount, cCount, aCount, poCount, eCount, epCount, exCount } = 0;

const livePending = () => {
  db('cart')
  .count('id').where({ status: 'Pending', expired: 'No' })
    .then(data => {
      if (data[0]) {
        pCount = data[0].count;
      }
      else {
        pCount = "Error in database";
      }
    }).catch(err => res.status(400).send('DB Connection failed!'))
}

const liveExpired = () => {
  db('cart')
  .count('id').where({ expired: 'Yes' })
    .then(data => {
      if (data[0]) {
        exCount = data[0].count;
      }
      else {
        exCount = "Error in database";
      }
    }).catch(err => res.status(400).send('DB Connection failed!'))
}

const livePaid = () => {
  db('cart')
  .count('id').where('status','=','Paid')
  .andWhere(db.raw('extract(month from date_created) = extract(month from current_date)'))
    .then(data => {
      if (data[0]) {
        poCount = data[0].count;
      }
      else {
        poCount = "Error in database";
      }
    }).catch(err => res.status(400).send('DB Connection failed!'))
}

const liveApproved = () => {
  db('cart')
  .count('id').where('status','=','Approved')
  .andWhere(db.raw('extract(month from date_created) = extract(month from current_date)'))
    .then(data => {
      if (data[0]) {
        aCount = data[0].count;
      }
      else {
        aCount = "Error in database";
      }
    }).catch(err => res.status(400).send('DB Connection failed!'))
}

const liveOrder = () => {
  db('cart')
  .count('id').where({
    status: 'Success'
  }).andWhere(db.raw('extract(month from date_purchased) = extract(month from current_date)'))
    .then(data => {
      if (data[0]) {
        oCount = data[0].count;
      }
      else {
        oCount = "Error in database";
      }
    }).catch(err => res.status(400).send('DB Connection failed!'))
}

const liveCancelled = () => {
  db('cart')
  .count('id').where({
    status: 'Cancelled'
  })
  .andWhere(db.raw('extract(month from date_created) = extract(month from current_date)'))
    .then(data => {
      if (data[0]) {
        cCount = data[0].count;
      }
      else {
        cCount = "Error in database";
      }
    }).catch(err => res.status(400).send('DB Connection failed!'))
}

const liveExchange = () => {
  db('exchange_items')
  .count('id').where('status','=','Success')
  .andWhere(db.raw('extract(month from exchange_date) = extract(month from current_date)'))
    .then(data => {
      if (data[0]) {
        eCount = data[0].count;
      }
      else {
        uCount = "Error in database";
      }
    }).catch(err => res.status(400).send('DB Connection failed!'))
}

const liveExchangeP = () => {
  db('exchange_items')
  .count('id').where('status','=','Pending')
  .andWhere(db.raw('extract(month from exchange_date) = extract(month from current_date)'))
    .then(data => {
      if (data[0]) {
        epCount = data[0].count;
      }
      else {
        uCount = "Error in database";
      }
    }).catch(err => res.status(400).send('DB Connection failed!'))
}

io.on('connection', (socket) =>{
  console.log('a user is connected');
    const liveUpdate = setInterval((data) => {
      livePending();
      liveExpired();
      liveOrder();
      liveCancelled();
      liveApproved();
      livePaid();
      liveExchange();
      liveExchangeP();
      socket.emit('live pending', pCount);
      socket.emit('live expired', exCount);
      socket.emit('live order', oCount);
      socket.emit('live cancelled', cCount);
      socket.emit('live approved', aCount);
      socket.emit('live paid', poCount);
      socket.emit('live exchange', eCount);
      socket.emit('live exchange pending', epCount);
    }, 1000)
    socket.on('disconnect', function(){
      clearInterval(liveUpdate);
  });
})

server.listen(3000,() => {
  console.log("Live at Port 3000");
});