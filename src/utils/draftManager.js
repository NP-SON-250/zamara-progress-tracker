const DRAFTS_KEY = "EmployeesBatchDrafts";

export const draftManager = {
  // Get all drafts
  getAllDrafts: () => {
    try {
      const drafts = localStorage.getItem(DRAFTS_KEY);
      return drafts ? JSON.parse(drafts) : [];
    } catch (error) {
      console.error("Error getting drafts:", error);
      return [];
    }
  },

  // Get a specific draft by document number
  getDraft: (documentNumber) => {
    try {
      const drafts = draftManager.getAllDrafts();
      return (
        drafts.find((d) => d.formData?.documentNumber === documentNumber) ||
        null
      );
    } catch (error) {
      console.error("Error getting draft:", error);
      return null;
    }
  },

  // Save a draft (updates if exists, adds if new)
  saveDraft: (draftData) => {
    try {
      const drafts = draftManager.getAllDrafts();
      const existingIndex = drafts.findIndex(
        (d) =>
          d.formData?.documentNumber === draftData.formData?.documentNumber,
      );

      const draftWithTimestamp = {
        ...draftData,
        lastUpdated: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        drafts[existingIndex] = draftWithTimestamp;
      } else {
        drafts.push(draftWithTimestamp);
      }

      // Keep only the latest 10 drafts
      const sortedDrafts = drafts
        .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
        .slice(0, 10);

      localStorage.setItem(DRAFTS_KEY, JSON.stringify(sortedDrafts));
      return true;
    } catch (error) {
      console.error("Error saving draft:", error);
      return false;
    }
  },

  // Delete a draft
  deleteDraft: (documentNumber) => {
    try {
      const drafts = draftManager.getAllDrafts();
      const filteredDrafts = drafts.filter(
        (d) => d.formData?.documentNumber !== documentNumber,
      );
      localStorage.setItem(DRAFTS_KEY, JSON.stringify(filteredDrafts));
      return true;
    } catch (error) {
      console.error("Error deleting draft:", error);
      return false;
    }
  },

  // Get next document number based on existing drafts and database
  getNextDocumentNumber: async (fetchLastFromDB) => {
    try {
      const drafts = draftManager.getAllDrafts();

      // Get all document numbers from drafts
      const draftNumbers = drafts
        .map((d) => d.formData?.documentNumber)
        .filter(Boolean)
        .map((num) => {
          const match = num.match(/DRN(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        });

      // Get last number from database
      let lastDBNumber = 0;
      try {
        const lastNumber = await fetchLastFromDB();
        if (lastNumber) {
          const match = lastNumber.match(/DRN(\d+)/);
          lastDBNumber = match ? parseInt(match[1], 10) : 0;
        }
      } catch (error) {
        console.error("Error fetching last DB number:", error);
      }

      // Find the maximum number from both sources
      const maxNumber = Math.max(...draftNumbers, lastDBNumber, 0);

      const nextNumber = maxNumber + 1;
      const paddedNum = nextNumber.toString().padStart(8, "0");
      return `DRN${paddedNum}`;
    } catch (error) {
      console.error("Error getting next document number:", error);
      return "DRN00000001";
    }
  },
};
