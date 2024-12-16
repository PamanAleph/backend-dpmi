const {
  findAll,
  findById,
  createData,
  updateData,
  deleteData,
  checkExistingEvaluation,
  evaluationsDataWithSetup,
  findEvaluationsByMajor,
  downloadEvaluations
} = require("../service/serviceEvaluations");
const PDFDocument = require("pdfkit");

const getAllData = async (req, res) => {
  try {
    const data = await findAll();
    res.json({
      response: {
        status: "success",
        message: "Data fetched successfully",
      },
      data: data,
    });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({
      response: {
        status: "error",
        message: "Internal server error",
        details: err.message,
      },
      data: null,
    });
  }
};

const getDataById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await findById(id);
    if (!data) {
      res.status(404).json({
        response: {
          status: "error",
          message: "Data not found",
        },
        data: null,
      });
    } else {
      res.json({
        response: {
          status: "success",
          message: "Data fetched successfully",
        },
        data: data,
      });
    }
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({
      response: {
        status: "error",
        message: "Internal server error",
        details: err.message,
      },
      data: null,
    });
  }
};

const createNewData = async (req, res) => {
  try {
    const data = await createData(req.body);
    res.status(201).json({
      response: {
        status: "success",
        message: "Data created successfully",
      },
      data: data,
    });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({
      response: {
        status: "error",
        message: "Internal server error",
        details: err.message,
      },
      data: null,
    });
  }
};

const updateExistingData = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const updatedData = await updateData(id, data);
    if (!updatedData) {
      res.status(404).json({
        response: {
          status: "error",
          message: "Data not found",
        },
        data: null,
      });
    } else {
      res.json({
        response: {
          status: "success",
          message: "Data updated successfully",
        },
        data: updatedData,
      });
    }
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({
      response: {
        status: "error",
        message: "Internal server error",
        details: err.message,
      },
      data: null,
    });
  }
};

const deleteDataById = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteData(id);
    res.json({
      response: {
        status: "success",
        message: "Data deleted successfully",
      },
    });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({
      response: {
        status: "error",
        message: "Internal server error",
        details: err.message,
      },
      data: null,
    });
  }
};

const checkingExistingEvaluation = async (req, res) => {
  const { setupId, majorIds, semester, endDate } = req.body;

  if (!Array.isArray(majorIds) || majorIds.length === 0) {
    return res.status(400).json({
      response: {
        status: "error",
        message: "majorIds must be a non-empty array.",
      },
      data: null,
    });
  }

  try {
    const dataExists = await checkExistingEvaluation(
      setupId,
      majorIds,
      semester,
      endDate
    );

    if (dataExists) {
      return res.status(409).json({
        response: {
          status: "error",
          message: "An evaluation with the exact same content already exists.",
        },
        data: null,
      });
    }

    res.json({
      response: {
        status: "success",
        message: "Data existence check completed successfully",
      },
      data: false,
    });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({
      response: {
        status: "error",
        message: "Internal server error",
        details: err.message,
      },
      data: null,
    });
  }
};

const evaluationData = async(req,res) => {
  try {
    const data = await evaluationsDataWithSetup();
    res.json({
      response: {
        status: "success",
        message: "Data fetched successfully",
      },
      data: data,
    });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({
      response: {
        status: "error",
        message: "Internal server error",
        details: err.message,
      },
      data: null,
    });
  }
}

const getEvaluationsByMajor = async (req, res) => {
  const { major_id } = req.query; 
  if (!major_id) {
    return res.status(400).json({
      response: {
        status: "error",
        message: "major_id is required in the request body",
      },
      data: null,
    });
  }

  try {
    const evaluations = await findEvaluationsByMajor(major_id);
    if (evaluations.length === 0) {
      return res.status(404).json({
        response: {
          status: "error",
          message: "No evaluations found for the specified major",
        },
        data: null,
      });
    }

    const transformedEvaluations = evaluations.map((evaluation) => ({
      evaluation_id: evaluation.id,
      setup_name: evaluation.setup_name,
      major_id: evaluation.major_id,
      major_name: evaluation.major_name,
      emails: evaluation.emails
        ? evaluation.emails.split(",").map((email) => email.trim()) 
        : [], 
      semester: evaluation.semester, 
      end_date: evaluation.end_date,
    }));

    res.json({
      response: {
        status: "success",
        message: "Evaluations fetched successfully",
      },
      data: transformedEvaluations,
    });
  } catch (error) {
    console.error("Error fetching evaluations by major:", error);
    res.status(500).json({
      response: {
        status: "error",
        message: "Internal server error",
        details: error.message,
      },
      data: null,
    });
  }
};

const getDownloadEvaluations = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await downloadEvaluations(id);

    if (!data) {
      return res.status(404).json({
        response: {
          status: "error",
          message: "Data not found",
        },
        data: null,
      });
    }

    res.status(200).json({
      response: {
        status: "success",
        message: "Data fetched successfully",
      },
      data,
    });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({
      response: {
        status: "error",
        message: "Internal server error",
        details: err.message,
      },
      data: null,
    });
  }
};

const downloadEvaluationPDF = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await downloadEvaluations(id);

    if (!data) {
      return res.status(404).json({
        response: {
          status: "error",
          message: "Data not found",
        },
        data: null,
      });
    }

    // Buat PDF
    const doc = new PDFDocument({ margin: 30, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="evaluation_${data.id}.pdf"`
    );

    doc.pipe(res);

    // **Header Report**
    doc
      .fontSize(18)
      .text("Evaluation Report", { align: "center", underline: true })
      .moveDown(0.5);

    doc.fontSize(12).text(`ID: ${data.id}`);
    doc.text(`Semester: ${data.semester}`);
    doc.text(`End Date: ${new Date(data.end_date).toLocaleDateString("id-ID")}`);
    doc.text(`Major: ${data.major_name} (ID: ${data.major_id})`);
    doc.text(`Setup Name: ${data.setup_name}`);
    doc.moveDown(1);

    // Loop setiap section
    data.sections.forEach((section, index) => {
      doc
        .fontSize(14)
        .fillColor("black")
        .text(`Section ${section.sequence}: ${section.name}`, {
          underline: true,
        })
        .moveDown(0.5);

      // Header Tabel
      doc
        .fontSize(10)
        .fillColor("black")
        .text("No.", 50, doc.y, { width: 50, align: "center" })
        .text("Question", 100, doc.y, { width: 250, align: "left" })
        .text("Answer", 350, doc.y, { width: 100, align: "center" })
        .text("Score", 450, doc.y, { width: 50, align: "center" });

      doc
        .moveTo(30, doc.y + 5)
        .lineTo(570, doc.y + 5)
        .strokeColor("#444")
        .stroke();

      // Isi tabel
      section.questions.forEach((question, questionIndex) => {
        doc
          .fontSize(10)
          .fillColor("#000")
          .text(`${questionIndex + 1}`, 50, doc.y + 5, {
            width: 50,
            align: "center",
          })
          .text(question.question, 100, doc.y, {
            width: 250,
            align: "left",
          })
          .text(question.answer || "-", 350, doc.y, {
            width: 100,
            align: "center",
          })
          .text(question.score !== null ? question.score : "-", 450, doc.y, {
            width: 50,
            align: "center",
          });

        doc
          .moveTo(30, doc.y + 5)
          .lineTo(570, doc.y + 5)
          .strokeColor("#E0E0E0")
          .stroke();
      });

      doc.moveDown(1);
    });

    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({
      response: {
        status: "error",
        message: "Internal server error",
        details: error.message,
      },
    });
  }
};

module.exports = {
  getAllData,
  getDataById,
  createNewData,
  updateExistingData,
  deleteDataById,
  checkingExistingEvaluation,
  evaluationData,
  getEvaluationsByMajor,
  getDownloadEvaluations,
  downloadEvaluationPDF,
};
