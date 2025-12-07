// const mongoose = require("mongoose");

// const admissionSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     // PERSONAL DETAILS (NO required here)
//     personal: {
//       fullName: String,
//       fatherName: String,
//       motherName: String,
//       dob: Date,
//       gender: String,
//       category: String,
//       nationality: String,
//       aadhaarNumber: String,
//     },

//     // CONTACT DETAILS
//     contact: {
//       permanentAddress: {
//         street: String,
//         city: String,
//         state: String,
//         pincode: String,
//       },
//       correspondenceAddress: {
//         street: String,
//         city: String,
//         state: String,
//         pincode: String,
//       },
//       phone: String,
//       alternatePhone: String,
//       email: String,
//     },

//     // EDUCATIONAL DETAILS
//     education: {
//       class10: {
//         board: String,
//         year: Number,
//         percentage: Number,
//       },
//       class12: {
//         board: String,
//         year: Number,
//         percentage: Number,
//       },
//       bachelors: {
//         degree: String,
//         university: String,
//         year: Number,
//         percentage: Number,
//         subjects: String,
//       },
//       masters: {
//         degree: String,
//         university: String,
//         year: Number,
//         percentage: Number,
//         thesisTitle: String,
//       },
//       mphil: {
//         university: String,
//         year: Number,
//         percentage: Number,
//         thesisTitle: String,
//       },
//       otherQualification: String,
//     },

//     // ENTRANCE
//     entranceExams: {
//       ugcNet: {
//         qualified: Boolean,
//         subject: String,
//         year: Number,
//         jrf: Boolean,
//       },
//       gate: {
//         qualified: Boolean,
//         discipline: String,
//         score: Number,
//         year: Number,
//       },
//       universityExam: {
//         appeared: Boolean,
//         year: Number,
//         score: Number,
//         rank: Number,
//       },
//     },

//     // EMPLOYMENT (REMOVED ENUM)
//     employment: {
//       employed: Boolean,
//       organization: String,
//       designation: String,
//       type: String,
//       experienceYears: Number,
//       duties: String,
//     },

//     // RESEARCH
//     research: {
//       area: String,
//       proposalTitle: String,
//       sop: String,
//       preferredSupervisor: {
//         name: String,
//         department: String,
//       },
//     },

//     // PUBLICATIONS
//     publications: [{ title: String, journal: String, year: Number }],

//     // DOCUMENTS (Cloudinary URLs)
//     documents: {
//       type: Map,
//       of: String,
//       default: {},
//     },

//     // PAYMENT
//     payment: {
//       status: {
//         type: String,
//         enum: ["Pending", "Success", "Failed"],
//         default: "Pending",
//       },
//       amount: { type: Number, default: 1500 },
//       transactionId: String,
//       paymentGateway: String,
//       paidAt: Date,
//     },

//     // APPLICATION
//     applicationStatus: {
//       type: String,
//       enum: [
//         "Draft",
//         "Submitted",
//         "Under Review",
//         "Shortlisted",
//         "Rejected",
//         "Accepted",
//       ],
//       default: "Draft",
//     },

//     adminRemarks: String,
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Admission", admissionSchema);

const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // PERSONAL DETAILS
    personal: {
      type: {
        fullName: { type: String, default: "" },
        fatherName: { type: String, default: "" },
        motherName: { type: String, default: "" },
        dob: Date,
        gender: { type: String, default: "" },
        category: { type: String, default: "" },
        nationality: { type: String, default: "Indian" },
        aadhaarNumber: { type: String, default: "" },
      },
      default: {},
    },

    // CONTACT DETAILS
    contact: {
      type: {
        permanentAddress: {
          type: {
            street: { type: String, default: "" },
            city: { type: String, default: "" },
            state: { type: String, default: "" },
            pincode: { type: String, default: "" },
          },
          default: {},
        },
        correspondenceAddress: {
          type: {
            street: { type: String, default: "" },
            city: { type: String, default: "" },
            state: { type: String, default: "" },
            pincode: { type: String, default: "" },
          },
          default: {},
        },
        phone: { type: String, default: "" },
        alternatePhone: { type: String, default: "" },
        email: { type: String, default: "" },
      },
      default: {},
    },

    // EDUCATIONAL DETAILS
    education: {
      type: {
        class10: {
          type: {
            board: { type: String, default: "" },
            year: Number,
            percentage: Number,
          },
          default: {},
        },
        class12: {
          type: {
            board: { type: String, default: "" },
            year: Number,
            percentage: Number,
          },
          default: {},
        },
        bachelors: {
          type: {
            degree: { type: String, default: "" },
            university: { type: String, default: "" },
            year: Number,
            percentage: Number,
            subjects: { type: String, default: "" },
          },
          default: {},
        },
        masters: {
          type: {
            degree: { type: String, default: "" },
            university: { type: String, default: "" },
            year: Number,
            percentage: Number,
            thesisTitle: { type: String, default: "" },
          },
          default: {},
        },
        mphil: {
          type: {
            university: { type: String, default: "" },
            year: Number,
            percentage: Number,
            thesisTitle: { type: String, default: "" },
          },
          default: {},
        },
        otherQualification: { type: String, default: "" },
      },
      default: {},
    },

    // ENTRANCE EXAMS
    entranceExams: {
      type: {
        ugcNet: {
          type: {
            qualified: { type: Boolean, default: false },
            subject: { type: String, default: "" },
            year: Number,
            jrf: { type: Boolean, default: false },
          },
          default: {},
        },
        gate: {
          type: {
            qualified: { type: Boolean, default: false },
            discipline: { type: String, default: "" },
            score: Number,
            year: Number,
          },
          default: {},
        },
        universityExam: {
          type: {
            appeared: { type: Boolean, default: false },
            year: Number,
            score: Number,
            rank: Number,
          },
          default: {},
        },
      },
      default: {},
    },

    // EMPLOYMENT - ✅ FIXED with explicit type definitions
    employment: {
      type: {
        employed: { type: Boolean, default: false },
        organization: { type: String, default: "" },
        designation: { type: String, default: "" },
        type: { type: String, default: "" },
        experienceYears: Number,
        duties: { type: String, default: "" },
      },
      default: {},
    },

    // RESEARCH
    research: {
      type: {
        area: { type: String, default: "" },
        proposalTitle: { type: String, default: "" },
        sop: { type: String, default: "" },
        preferredSupervisor: {
          type: {
            name: { type: String, default: "" },
            department: { type: String, default: "" },
          },
          default: {},
        },
      },
      default: {},
    },

    // PUBLICATIONS
    publications: [
      {
        title: String,
        journal: String,
        year: Number,
      },
    ],

    // DOCUMENTS (Cloudinary URLs)
    documents: {
      type: Map,
      of: String,
      default: {},
    },

    // PAYMENT
    payment: {
      status: {
        type: String,
        enum: ["Pending", "Success", "Failed"],
        default: "Pending",
      },
      amount: { type: Number, default: 1500 },
      transactionId: String,
      paymentGateway: String,
      paidAt: Date,
    },

    // APPLICATION STATUS
    applicationStatus: {
      type: String,
      enum: [
        "Draft",
        "Submitted",
        "Under Review",
        "Shortlisted",
        "Rejected",
        "Accepted",
      ],
      default: "Draft",
    },

    submittedAt: Date,
    adminRemarks: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admission", admissionSchema);
