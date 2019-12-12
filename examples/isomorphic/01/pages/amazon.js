import React from 'react';
import { DFPSlotsProvider, DFPManager, AdSlot, BidManager } from 'react-dfp';
import Highlight from 'react-syntax-highlighter';

const network = process.env.npm_package_config_dfp_id;
const adunit1 = process.env.npm_package_config_adunit_1;
const adunit2 = process.env.npm_package_config_adunit_2;
const pubID = process.env.npm_package_config_amazon_pub_id;
const adServer = process.env.npm_package_config_amazon_ad_service;

const amazonConfig = {
  pubID,
  adServer,
};

BidManager.getBidsLoaderScript(amazonConfig);

/* we pass all the default props through <DFPSlotsProvider> and then all
 * its netsted AdSlot children will pick the values.
 */
export default () => (
  <div>
    <h1>Amazon APS</h1>
    <DFPSlotsProvider
      dfpNetworkId={network}
      amazonConfig={amazonConfig}
      collapseEmptyDivs
      singleRequest
    >
      <div>
        <div className="ad-example-728x90">
          <AdSlot adUnit={adunit1} sizes={[[728, 90]]} withBids />
          <Highlight>
            {'<AdSlot sizes={[[728, 90]]} withBids />'}
          </Highlight>
        </div>
        <div className="ad-example-300x250">
          <AdSlot adUnit={adunit2} sizes={[[728, 90]]} withBids />
          <Highlight>
            {'<AdSlot sizes={[[728, 90]]}/> withBids'}
          </Highlight>
        </div>
      </div>
    </DFPSlotsProvider>

    <div className="controls">
      <button onClick={() => DFPManager.refresh()}> Refresh ads</button>
      <Highlight>
        {'<button onClick={()=> DFPManager.refresh()}> Refresh ads</button>'}
      </Highlight>
    </div>
  </div>
);
