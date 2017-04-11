var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var brandSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    maxlength: [50, "Title should not exceed 50 letters"],
    unique: true
  },
  key: {
    type: String,
    maxlength: [20, "Key should not exceed 20 letters"],
    unique: true
  },
  status: {
    type: Boolean,
    default: 'true'
  }
});

/**
 * Pre-save hook
 */
brandSchema.pre('save', function (next) {
  var title = this.title;
  this.key = title.replace(/[^A-Z0-9]+/ig, "_").toLowerCase();
  next();
});

// the below validations only apply if you are signing up traditionally
brandSchema.path('key').validate(function (key, fn) {
  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('key')) {
    this.model('Brand').find({ key: key }).exec(function (err, brands) {
      fn(!err && brands.length === 0);
    });
  } else fn(true);
}, 'Key already exists');

// the below validations only apply if you are signing up traditionally
brandSchema.path('title').validate(function (title, fn) {
  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('title')) {
    this.model('Brand').find({ title: title }).exec(function (err, brands) {
      fn(!err && brands.length === 0);
    });
  } else fn(true);
}, 'Title already exists');

module.exports = mongoose.model('Brand', brandSchema);