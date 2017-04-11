var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var categorySchema = new Schema({
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
categorySchema.pre('save', function (next) {
  var title = this.title;
  this.key = title.replace(/[^A-Z0-9]+/ig, "_").toLowerCase();
  next();
});

// the below validations only apply if you are signing up traditionally
categorySchema.path('key').validate(function (key, fn) {
  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('key')) {
    this.model('Category').find({ key: key }).exec(function (err, categories) {
      fn(!err && categories.length === 0);
    });
  } else fn(true);
}, 'Key already exists');

// the below validations only apply if you are signing up traditionally
categorySchema.path('title').validate(function (title, fn) {
  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('title')) {
    this.model('Category').find({ title: title }).exec(function (err, categories) {
      fn(!err && categories.length === 0);
    });
  } else fn(true);
}, 'Title already exists');

module.exports = mongoose.model('Category', categorySchema);