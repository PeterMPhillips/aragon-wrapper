import test from 'ava';
import ThreeBoxBot from '@openworklabs/three-box-bot';

import { ThreeBoxIdentityProvider } from './index';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const hardcodedImageCid = 'QmXBDtwGr6EJ9PyX7LnTz2ohCp8qUTNZn1TkWQ1vjenqD2';
const completedBoxValues = {
  name: 'jon',
  image: [
    {
      contentUrl: {
        '/': hardcodedImageCid,
      },
    },
  ],
};

const boxWithNoImage = { name: 'schwartz' };
const boxWithNoName = {
  image: [
    {
      contentUrl: {
        '/': hardcodedImageCid,
      },
    },
  ],
};

test.before(async t => {
  const boxBot = new ThreeBoxBot(
    'https://rinkeby.infura.io/v3/87f3c8e1836c442d87583ee9a4f3053a'
  );

  const [completedBoxEthAddress] = await boxBot.createProfile(
    completedBoxValues
  );
  const [boxWithNoImageEthAddress] = await boxBot.createProfile(boxWithNoImage);
  const [boxWithNoNameEthAddress] = await boxBot.createProfile(boxWithNoName);
  const noBoxEthAddress = await boxBot.returnAddressWithNoProfile();

  t.context.completedBoxEthAddress = completedBoxEthAddress;
  t.context.boxWithNoImageEthAddress = boxWithNoImageEthAddress;
  t.context.boxWithNoNameEthAddress = boxWithNoNameEthAddress;
  t.context.noBoxEthAddress = noBoxEthAddress;

  // give 3box some time to set the profile properly
  await sleep(10000);
});

test.beforeEach(async t => {
  t.context.threeBoxIdentityProvider = new ThreeBoxIdentityProvider();
});

test('should throw an error when no address is passed', async t => {
  t.plan(2);
  const provider = t.context.threeBoxIdentityProvider;

  const error = await t.throwsAsync(
    async () => {
      await provider.resolve();
    },
    {
      instanceOf: Error,
      message: 'address is required when resolving a 3box identity',
    }
  );

  t.is(error.message, 'address is required when resolving a 3box identity');
});

test.serial(
  'resolving through completed 3box should return correct identity metadata',
  async t => {
    t.plan(3);
    const completedBoxEthAddress = t.context.completedBoxEthAddress;
    const {
      createdAt,
      imageCid,
      name,
    } = await t.context.threeBoxIdentityProvider.resolve(
      completedBoxEthAddress
    );
    t.is(name, completedBoxValues.name);
    t.is(imageCid, hardcodedImageCid);
    t.is(createdAt, null);
  }
);

test.serial(
  'resolving through 3box without a "name" field should return eth address instead',
  async t => {
    t.plan(1);
    const boxWithNoNameEthAddress = t.context.boxWithNoNameEthAddress;
    const { name } = await t.context.threeBoxIdentityProvider.resolve(
      boxWithNoNameEthAddress
    );
    t.is(name, boxWithNoNameEthAddress);
  }
);

test.serial(
  'resolving through 3box without an "image" field should return null for imageCid',
  async t => {
    t.plan(1);
    const boxWithNoImageEthAddress = t.context.boxWithNoImageEthAddress;
    const { imageCid } = await t.context.threeBoxIdentityProvider.resolve(
      boxWithNoImageEthAddress
    );
    t.is(imageCid, null);
  }
);

test.serial(
  'should return null when resolving non existent 3box identity',
  async t => {
    t.plan(1);
    const noBoxEthAddress = t.context.noBoxEthAddress;
    const box = await t.context.threeBoxIdentityProvider.resolve(
      noBoxEthAddress
    );
    t.is(box, null);
  }
);
