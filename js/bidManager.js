import * as Utils from './utils';
import DFPManager from './manager';

const BidManager = {
  bidsScriptIsRequested: false,
  slots: {},
  bidsScriptLoadPromise: null,
  slotsHash: '',
  registerSlot(slotID, sizes, adUnit) {
    this.slots[slotID] = {
      slotID,
      sizes,
      slotName: adUnit,
    };
  },

  getSlotsByIDs(IDs) {
    return this.getSlots().filter(slot => IDs.indexOf(slot.slotID) !== -1);
  },

  getSlotsHash(slots) {
    return slots.map(slot => slot.slotID).join('-');
  },

  unregisterSlot(slotID) {
    delete this.slots[slotID];
  },

  areSlotsEmpty() {
    return Object.values(this.slots).length === 0;
  },

  getSlots() {
    return Object.values(this.slots);
  },

  clearSlots() {
    this.slots = {};
  },

  getBidsLoaderScript(config) {
    this.bidsScriptIsRequested = true;
    return DFPManager.getGoogletag()
      .then(() => {
        if (this.bidsScriptLoadPromise === null) {
          this.bidsScriptLoadPromise = Utils.loadBidsScript(config);
        }
        return this.bidsScriptLoadPromise;
      })
      .catch(error => console.info(error.message));
  },

  requestBids(apstag, slots = this.getSlots()) {
    const slotsHash = this.getSlotsHash(slots);

    return new Promise((resolve, reject) => {
      if (this.slotsHash === slotsHash) {
        reject();
        return;
      }
      this.slotsHash = slotsHash;
      apstag.fetchBids(
        {
          slots,
          timeout: 2e3,
        },
        (bids) => {
          if (bids.length > 0) {
            apstag.setDisplayBids();
            resolve();
            this.slotsHash = '';
          }
        },
      );
    });
  },

  applyBids(slots) {
    return new Promise((resolve, reject) => {
      if (BidManager.bidsScriptIsRequested && !BidManager.areSlotsEmpty()) {
        BidManager.getBidsLoaderScript()
          .then(apstag => BidManager.requestBids(apstag, slots))
          .catch(error => console.error(error.message))
          .then(resolve)
          .catch(() => { console.info('Bids request is in progress'); });
      } else {
        reject({ message: 'Bids not applicable' });
      }
    });
  },
};

export default BidManager;
