var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var Category = require('./category');
var Brand = require('./brand');

var productSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    maxlength: [100, "Title should not exceed 100 letters"],
    unique: true
  },
  key: {
    type: String,
    maxlength: [100, "Key should not exceed 100 letters"],
    unique: true
  },
  sku: {
    type: String,
    required: [true, "SKU Code is required"],
    maxlength: [20, "SKU should not exceed 20 letters"],
    unique: true
  },
  image: {
    type: Schema.Types.Mixed,
    required: false,
  },
  price: {
    type: Number,
    required : [true, "Price is required"],
    validate : {
      validator : Number.isInteger,
      message   : 'Price is invalid'
    }
  },
  brand: {
    type: String,
    required: [true, "Brand is required"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
  },
  status: {
    type: Boolean,
    default: 'true'
  },
  featured: {
    type: Boolean,
    default: 'false'
  },
  stock: {
    type     : Number,
    required : [true, "Stock is required"],
    validate : {
      validator : Number.isInteger,
      message   : '{VALUE} is not an integer value'
    }
  },
});

productSchema.path('title').validate(function (title, fn) {
  // Check only when it is a new record or when title field is modified
  if (this.isNew || this.isModified('title')) {
    this.model('Product').find({ title: title }).exec(function (err, products) {
      fn(!err && products.length === 0);
    });
  } else fn(true);
}, 'Duplicate Product Title');

/**
 * Pre-save hook
 */
productSchema.pre('save', function (next) {
  var title = this.title;
  this.key = title.replace(/[^A-Z0-9]+/ig, "_").toLowerCase();
  next();
});

productSchema.path('key').validate(function (key, fn) {
  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('key')) {
    this.model('Product').find({ key: key }).exec(function (err, products) {
      fn(!err && products.length === 0);
    });
  } else fn(true);
}, 'Duplicate Product Key');

productSchema.path('sku').validate(function (sku, fn) {
  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('sku')) {
    this.model('Product').find({ sku: sku }).exec(function (err, products) {
      fn(!err && products.length === 0);
    });
  } else fn(true);
}, 'Duplicate SKU Code');

productSchema.path('brand').validate(function (brand, fn) {
  // Check only when it is a new user or when email field is modified
  Brand.find({$and:[{key:brand},{status:true}]}).exec(function (err, brands) {
    fn(!err || !(brands.length === 0));
  });
}, 'Invalid brand selected');


productSchema.path('category').validate(function (category, fn) {
  // Check only when it is a new user or when email field is modified
  Brand.find({$and:[{key:category},{status:true}]}).exec(function (err, categories) {
    fn(!err || !(categories.length === 0));
  });
}, 'Invalid category selected');

var model = mongoose.model('Product', productSchema);
module.exports = model;

