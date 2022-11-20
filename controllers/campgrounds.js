const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');


module.exports.index = async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
	res.render('campgrounds/new');
};

module.exports.create = async (req, res) => {
	
	const campground = new Campground(req.body.campground);
	campground.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
	//console.log(req.files);
	campground.author = req.user._id;
	await campground.save();
	req.flash('success', 'Campground added successfully!');
	res.redirect(`/campgrounds/${campground._id}`);
};



module.exports.detail = async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findById(id)
		.populate({
			path: 'reviews',
			populate: {
				path: 'author'
			}
		})
		.populate('author');
	if (!campground) {
		req.flash('error', 'Campground does not exist!');
		return res.redirect('/campgrounds');
	}
	res.render('campgrounds/show', { campground });
};

module.exports.renderEditForm = async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	if (!campground) {
		req.flash('error', 'Campground does not exist!');
		return res.redirect('/campgrounds');
	}
	res.render('campgrounds/edit', { campground });
};

module.exports.update = async (req, res) => {
	const { id } = req.params;
	const { campground } = req.body;
	const camp = await Campground.findByIdAndUpdate(id, campground, { new: true });
	const img = req.files.map((f) => ({ url: f.path, filename: f.filename }));
	camp.images.push(...img);
	await camp.save();
	if (req.body.deleteImages) {
		for (let filename of req.body.deleteImages) {
			await cloudinary.uploader.destroy(filename);
		}
		await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
	}
	req.flash('success', 'Campground updated!');
	res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.destroy = async (req, res) => {
	const { id } = req.params;
	await Campground.findByIdAndDelete(id);
	req.flash('success', 'Campground deleted successfully!');
	res.redirect('/campgrounds');
};
