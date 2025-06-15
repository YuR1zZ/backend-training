import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription Name is Required'],
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    price : {
        type: Number,
        requied :[true, 'Subscription Price is Required'],
        min:[0, 'Price cannot be less than 0'],
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP'],
        default: 'USD',
    },
    frequency : {
        type: String,
        enum: ['daily','weekly','monthly', 'yearly'],
    },
    category: {
        type: String,
        enum: ['sports','news','entertainment', 'utilities', 'food', 'health', 'other'],
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum : ['active', 'expired', 'cancelled'],
        default: 'active',
    },
    startDate: {
        type: Date,
        requied : true,
        validate : {
            validator: (value) => value <= new Date(),
            message: 'Start date cannot be in the future',
    },
    },
    renewalDate : {
        type: Date,
        validate : {
            validator: function(value){
                return value > this.startDate;
            },
            message: 'Renewal date must be after start date',
    },
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true,
        index : true,
    }
}, { timestamps: true });

// auto calculate the renewal date if missing
subscriptionSchema.pre('save', function(next) {
    if(!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        }

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    //auto-update the status if renewal date has passed
    if(this.renewalDate < new Date()) {
        this.status = 'expired';
    }

    next();
})
const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;