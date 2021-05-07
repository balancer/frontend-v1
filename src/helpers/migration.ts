import config from '@/config';
import { bnum, scale } from './utils';
import { _exactTokensInForBPTOut } from '@balancer-labs/sor2/dist/pools/weightedPool/weightedMathEvm';
import { fnum } from '@balancer-labs/sor2/dist/math/lib/fixedPoint';

const pools = {
  1: {
    '0x037e5ed72cffa7407c9d14a6ebdc3d2ab920ac13':
      '0x186084ff790c65088ba694df11758fae4943ee9e',
    '0x09574f862d32794b8636cfb9c98e6597be049c4b':
      '0x16faf9f73748013155b7bc116a3008b57332d1e6',
    '0x09772046e7e33c15acdf15a3ed495cc9557f269c':
      '0x96646936b91d6b9d7d0c47c496afbf3d6ec7b6f8',
    '0x0aa69e22e0dbd5daea0101415aa7b9b28147f3ae':
      '0x5aa90c7362ea46b3cbfbd7f01ea5ca69c98fef1c',
    '0x0badc63d5cc7a25007f7c35acc23369c00df6ee7':
      '0x45910faff3cbf990fdb204682e93055506682d17',
    '0x0f688ad74acaebe360e53ad18c8a6cb9df6c8e6a':
      '0x0b09dea16768f0799065c475be02919503cb2a35',
    '0x120b12ec8012635cefcd8f2c5471f5d94a6bd853':
      '0xaac98ee71d4f8a156b6abaa6844cdb7789d086ce',
    '0x156503901efec20d45f9ee1f393c8614423362d7':
      '0x0b09dea16768f0799065c475be02919503cb2a35',
    '0x165a50bc092f6870dc111c349bae5fc35147ac86':
      '0x0b09dea16768f0799065c475be02919503cb2a35',
    '0x18b5cb6b881edede9b7773e6a0c9bef45ac92168':
      '0x0b09dea16768f0799065c475be02919503cb2a35',
    '0x1be4c2afd3705cbe6dbbe45b1f87a637616683f5':
      '0x5aa90c7362ea46b3cbfbd7f01ea5ca69c98fef1c',
    '0x1eff8af5d577060ba4ac8a29a13525bb0ee2a3d5':
      '0xa6f548df93de924d73be7d25dc02554c6bd66db5',
    '0x1fdc7c71c84306d97f8aca8f039fb97ca5271cf6':
      '0xe99481dc77691d8e2456e5f3f61c1810adfc1503',
    '0x2090e54cd3c2dd9d9e9ca3a19dcc311a692d7639':
      '0x3ebf48cd7586d7a4521ce59e53d9a907ebf1480f',
    '0x221bf20c2ad9e5d7ec8a9d1991d8e2edcfcb9d6c':
      '0xa6f548df93de924d73be7d25dc02554c6bd66db5',
    '0x2471de1547296aadb02cc1af84afe369b6f67c87':
      '0x96646936b91d6b9d7d0c47c496afbf3d6ec7b6f8',
    '0x24d97eed6e171e70c82bc60afd37c7d1e549a0ad':
      '0x80be0c303d8ad2a280878b50a39b1ee8e54dbd22',
    '0x24f598f7df68f663bcac6f94bec005a48570d7a4':
      '0xea8886a24b6e01fba88a9e98d794e8d1f29ed863',
    '0x294de1cde8b04bf6d25f98f1d547052f8080a177':
      '0xa6f548df93de924d73be7d25dc02554c6bd66db5',
    '0x2bf026317d03e95a367ccb81ca247c04fa97b1e2':
      '0x4626d81b3a1711beb79f4cecff2413886d461677',
    '0x2c5b2e3c9d6051303ed2f55b99a4d9db2fec4b9d':
      '0xa6f548df93de924d73be7d25dc02554c6bd66db5',
    '0x2e41132dab88a9bad80740a1392d322bf023d494':
      '0x4626d81b3a1711beb79f4cecff2413886d461677',
    '0x2e933a4612c4fa03b258c2fd183c299d099975be':
      '0x3ebf48cd7586d7a4521ce59e53d9a907ebf1480f',
    '0x354a3cea8636982c2293dfa565e0445d85efd930':
      '0xaac98ee71d4f8a156b6abaa6844cdb7789d086ce',
    '0x364b12e8f821edd4a8d7bc3ad545e4021ef2afe6':
      '0x16faf9f73748013155b7bc116a3008b57332d1e6',
    '0x39ee0f29253017d69909b7286caf8c080e9d6da2':
      '0x7eb878107af0440f9e776f999ce053d277c8aca8',
    '0x3b0f0aae0fbc53173db9e39f9fd46df805518f62':
      '0x96646936b91d6b9d7d0c47c496afbf3d6ec7b6f8',
    '0x3bd8f51b08b0518d33c848d121286e14f52c5c70':
      '0xa6f548df93de924d73be7d25dc02554c6bd66db5',
    '0x3d67f5fa074f39d946b29fe86bd2539709771e1c':
      '0x072f14b85add63488ddad88f855fda4a99d6ac9b',
    '0x3fcb001fc6a3ab35229d8d50b6675ef97fd20e16':
      '0xe99481dc77691d8e2456e5f3f61c1810adfc1503',
    '0x4118f3935231c517a71e154ab945249e5b9ed684':
      '0xaac98ee71d4f8a156b6abaa6844cdb7789d086ce',
    '0x41284a88d970d3552a26fae680692ed40b34010c':
      '0x186084ff790c65088ba694df11758fae4943ee9e',
    '0x43b7bb5b7937fe1462b6dfefdf436a4b98fe3f91':
      '0x186084ff790c65088ba694df11758fae4943ee9e',
    '0x47a89dbe876ffa34580c86b891e21648130f58b9':
      '0x96646936b91d6b9d7d0c47c496afbf3d6ec7b6f8',
    '0x48b062b282d441283e2b2247ffd415dab67b940e':
      '0x9c08c7a7a89cfd671c79eacdc6f07c1996277ed5',
    '0x4a4d78ddf927574d7e6f8304f4cc3f70a043f2d0':
      '0xde148e6cc3f6047eed6e97238d341a2b8589e19e',
    '0x4b47b11c353f0056c73a87fefccb6c43dc0d8065':
      '0x0b09dea16768f0799065c475be02919503cb2a35',
    '0x4d4629567309a78f8221394604cfa70be4dd5d31':
      '0x16faf9f73748013155b7bc116a3008b57332d1e6',
    '0x4d6c17259332b3a1229bc4938894a7d295f90aeb':
      '0x96646936b91d6b9d7d0c47c496afbf3d6ec7b6f8',
    '0x4f127918c2b366d829256771ca636f7250c627ca':
      '0x96646936b91d6b9d7d0c47c496afbf3d6ec7b6f8',
    '0x4fa407ec9fad5b87a2c15ed579e021f8320017dd':
      '0x0b09dea16768f0799065c475be02919503cb2a35',
    '0x5220c7b304f69853e94c8894dbf87e0873b6428e':
      '0x0b09dea16768f0799065c475be02919503cb2a35',
    '0x527d1ff73dbc5525b8e049ac5684a788c709fe19':
      '0xec60a5fef79a92c741cb74fdd6bfc340c0279b01',
    '0x5726406d034fe8a83497ac7500009c24b03925f8':
      '0xf8a0623ab66f985effc1c69d05f1af4badb01b00',
    '0x57deed1a0e86b92bd30037317f61aa76bf000a94':
      '0xaac98ee71d4f8a156b6abaa6844cdb7789d086ce',
    '0x585846fafae6740c2dc68c64f8c6b32a77c1cc94':
      '0x16faf9f73748013155b7bc116a3008b57332d1e6',
    '0x59416e1aa15aab32a3ac42e34d564aa38092d1cc':
      '0x5d563ca1e2daaae3402c36097b934630ab53702c',
    '0x59a19d8c652fa0284f44113d0ff9aba70bd46fb4':
      '0x5c6ee304399dbdb9c8ef030ab642b10820db8f56',
    '0x5aec4cff7fc3880ade1582e5e37cf89152e70ace':
      '0xec60a5fef79a92c741cb74fdd6bfc340c0279b01',
    '0x5b475f2cc362265ddf6a958f3519a35b305d2824':
      '0xaac98ee71d4f8a156b6abaa6844cdb7789d086ce',
    '0x5e37419f5b87eb6911dc53f63f5a412522eca0c2':
      '0x0b09dea16768f0799065c475be02919503cb2a35',
    '0x60e6b01456fc55de0d893487c7c9cd0851c97064':
      '0xf8a0623ab66f985effc1c69d05f1af4badb01b00',
    '0x6161ad4de05d431b40fd7a9d0e207b030921af11':
      '0x16faf9f73748013155b7bc116a3008b57332d1e6',
    '0x625699f04521179e2a5ea43a34441828094fd832':
      '0x5c6ee304399dbdb9c8ef030ab642b10820db8f56',
    '0x6320bacd752eb602fecff80d75b8a3be57b7f282':
      '0x9c08c7a7a89cfd671c79eacdc6f07c1996277ed5',
    '0x6339f81d166b074c661f837df4560ca267ef05fe':
      '0xf8a0623ab66f985effc1c69d05f1af4badb01b00',
    '0x653911da49db4cdb0b7c3e4d929cfb56024cd4e6':
      '0xde148e6cc3f6047eed6e97238d341a2b8589e19e',
    '0x687a13a016f038ed9b40ad518766619f6f4de8f5':
      '0x072f14b85add63488ddad88f855fda4a99d6ac9b',
    '0x69e0b64b2cdf61042753a56807829557ec576c34':
      '0xa6f548df93de924d73be7d25dc02554c6bd66db5',
    '0x6b9887422e2a4ae11577f59ea9c01a6c998752e2':
      '0x3ebf48cd7586d7a4521ce59e53d9a907ebf1480f',
    '0x6bd73b07d48626aa4915709c57087cb098546ae6':
      '0x3ebf48cd7586d7a4521ce59e53d9a907ebf1480f',
    '0x6c323c144a8d1748c6ca517b6c386561bfd599e3':
      '0xa6f548df93de924d73be7d25dc02554c6bd66db5',
    '0x6ca4732e385ea5475ac7cd1be3f4d0fb97a498ea':
      '0x3ebf48cd7586d7a4521ce59e53d9a907ebf1480f',
    '0x6cb5c5cb789fae62ce5ce280e1fbc5dd3bbdad81':
      '0x6ae82385f76e3742f89cb46343b169f6ee49de1b',
    '0x6d7ae4ab00471daa4151b59181dabddc00646e2f':
      '0xefaa1604e82e1b3af8430b90192c1b9e8197e377',
    '0x6ebbeed66adf3927528559a7a60e4fdd2d63302c':
      '0x0b09dea16768f0799065c475be02919503cb2a35',
    '0x6f518b88234aa3727b0cd98122270769aba9c32b':
      '0x5aa90c7362ea46b3cbfbd7f01ea5ca69c98fef1c',
    '0x70f1c87b22d7371c68e3ea64870833a2a64cf8b3':
      '0xde148e6cc3f6047eed6e97238d341a2b8589e19e',
    '0x726496deb01afbbe23e314841818ccf0aaddae0c':
      '0x9f1f16b025f703ee985b58ced48daf93dad2f7ef',
    '0x72c4d884245d80c6eeb89f9774def966e883c6d1':
      '0x96646936b91d6b9d7d0c47c496afbf3d6ec7b6f8',
    '0x73afa3d21a5e6b2426671814f22a3b89d76aeb0f':
      '0x0b09dea16768f0799065c475be02919503cb2a35',
    '0x75e3198907f7346ca1662694b22ab26ec6232690':
      '0xe99481dc77691d8e2456e5f3f61c1810adfc1503',
    '0x7693b8f973d1cd8f990a42605ad9ed86ad768d58':
      '0x072f14b85add63488ddad88f855fda4a99d6ac9b',
    '0x77f5f3dfd95d0b061c9ef47c4f4ca4681d807776':
      '0xe99481dc77691d8e2456e5f3f61c1810adfc1503',
    '0x794fca00cfc6cc2f7e9362cbd329bfea569132e3':
      '0x45910faff3cbf990fdb204682e93055506682d17',
    '0x7a6b48884ce0431412e7f0614c22c1fbabdf18b2':
      '0xde148e6cc3f6047eed6e97238d341a2b8589e19e',
    '0x7afe74ae3c19f070c109a38c286684256adc656c':
      '0x0b09dea16768f0799065c475be02919503cb2a35',
    '0x7b3e1dcc52bf9d60d66627e359401953467ff568':
      '0x9f1f16b025f703ee985b58ced48daf93dad2f7ef',
    '0x8031bcb8bbae620f17fbc88e800633a69664ad62':
      '0xa6f548df93de924d73be7d25dc02554c6bd66db5',
    '0x80b42669f3d8bba7618800efe6aed60d90f72e9d':
      '0xa6f548df93de924d73be7d25dc02554c6bd66db5',
    '0x868a6d816da311b05e939e4e0ba7aef2801fd073':
      '0xe99481dc77691d8e2456e5f3f61c1810adfc1503',
    '0x8a649274e4d777ffc6851f13d23a86bbfa2f2fbf':
      '0x96646936b91d6b9d7d0c47c496afbf3d6ec7b6f8',
    '0x8b6e6e7b5b3801fed2cafd4b22b8a16c2f2db21a':
      '0x0b09dea16768f0799065c475be02919503cb2a35',
    '0x8c101f823f94252656e8375557b524459e6e196c':
      '0x5d563ca1e2daaae3402c36097b934630ab53702c',
    '0x8c43ba2623107f846871366577a8ead5266d7e88':
      '0x9c08c7a7a89cfd671c79eacdc6f07c1996277ed5',
    '0x8c551a2f7c12c695894ea1876125da363f13c6c1':
      '0x5aa90c7362ea46b3cbfbd7f01ea5ca69c98fef1c',
    '0x8dea3d0c882fb30c47e478aa1d1885de68b9978d':
      '0x16faf9f73748013155b7bc116a3008b57332d1e6',
    '0x9289191fdaab465f78a6c3efd405ec72e6f092dc':
      '0x96646936b91d6b9d7d0c47c496afbf3d6ec7b6f8',
    '0x930ae255053e40f430a4fda533eae0de5b131924':
      '0x5aa90c7362ea46b3cbfbd7f01ea5ca69c98fef1c',
    '0x945907435c20c908356b19581b0491e500508c12':
      '0x231e687c9961d3a27e6e266ac5c433ce4f8253e4',
    '0x9588dcdc8b4fe73f1312469818405f02465bcfbc':
      '0x4626d81b3a1711beb79f4cecff2413886d461677',
    '0x9866772a9bdb4dc9d2c5a4753e8658b8b0ca1fc3':
      '0xaac98ee71d4f8a156b6abaa6844cdb7789d086ce',
    '0x987d7cc04652710b74fff380403f5c02f82e290a':
      '0xaac98ee71d4f8a156b6abaa6844cdb7789d086ce',
    '0x99e582374015c1d2f3c0f98d0763b4b1145772b7':
      '0x0b09dea16768f0799065c475be02919503cb2a35',
    '0x9d5db11111f57facf918d1f4e009d39fcd781f31':
      '0xec60a5fef79a92c741cb74fdd6bfc340c0279b01',
    '0x9dde0b1d39d0d2c6589cde1bfed3542d2a3c5b11':
      '0x5c6ee304399dbdb9c8ef030ab642b10820db8f56',
    '0x9e7cbc6e96993e7c5abb3ec4cb30aa8275618b2b':
      '0x3ebf48cd7586d7a4521ce59e53d9a907ebf1480f',
    '0xa1d31cba7d48731c9fb9359f583dee3d7bcf9e5a':
      '0x96646936b91d6b9d7d0c47c496afbf3d6ec7b6f8',
    '0xa33a45749d4a4118ad119f7e6c1474ab568f5928':
      '0x16faf9f73748013155b7bc116a3008b57332d1e6',
    '0xa35321206760f3d979e88d8a1b8c536bfcc68177':
      '0x96646936b91d6b9d7d0c47c496afbf3d6ec7b6f8',
    '0xa71f8151661c98678d89a4a463629ff7dd030c3b':
      '0x16faf9f73748013155b7bc116a3008b57332d1e6',
    '0xa97a516f59b14fac3420a2ffabf3891945af3a90':
      '0x0b09dea16768f0799065c475be02919503cb2a35',
    '0xb0e7c0ea48f4d1bf187ee64795e1adc180dbd889':
      '0xde148e6cc3f6047eed6e97238d341a2b8589e19e',
    '0xb1d218c6811ac2c4c26644ed45a8a161a15941fc':
      '0x0b09dea16768f0799065c475be02919503cb2a35',
    '0xb1f9ec02480dd9e16053b010dfc6e6c4b72ecad5':
      '0xf8a0623ab66f985effc1c69d05f1af4badb01b00',
    '0xb485fe9998285f23b86b3b99f41799c367894166':
      '0x5aa90c7362ea46b3cbfbd7f01ea5ca69c98fef1c',
    '0xb624c7d3b7daddea8825fa39e764f35d02a1b1ca':
      '0x96646936b91d6b9d7d0c47c496afbf3d6ec7b6f8',
    '0xb72b8bb10a66473a53087fdf7c835fe0bed1f989':
      '0x0b09dea16768f0799065c475be02919503cb2a35',
    '0xba20d4f41121b997a1eaca6d938ac40b67dad226':
      '0x9f1f16b025f703ee985b58ced48daf93dad2f7ef',
    '0xbaefce218c8f686be26f1b263259a5e23bf4ac6d':
      '0xa6f548df93de924d73be7d25dc02554c6bd66db5',
    '0xbc8b1f78ff5a0baf9945e145832ad79c494d4cf6':
      '0x8a92c3afabab59101b4e2426c82a7ddbb66b5450',
    '0xbddf5c35b183a30b946d0b54010b9d5c860ffae4':
      '0x16faf9f73748013155b7bc116a3008b57332d1e6',
    '0xbed340a301b4f07fa7b61ab9e0767faa172f530d':
      '0x5aa90c7362ea46b3cbfbd7f01ea5ca69c98fef1c',
    '0xc1fe5ef78707148f8bad18e5b8fccaef985e62f1':
      '0xa6f548df93de924d73be7d25dc02554c6bd66db5',
    '0xc2fccdb698862ceb2d54e22f6d1eb50cbea51960':
      '0x16faf9f73748013155b7bc116a3008b57332d1e6',
    '0xc48b8329d47ae8fd504c0b81cf8435486380e858':
      '0xefaa1604e82e1b3af8430b90192c1b9e8197e377',
    '0xcb11313f4b9071736b28c2f616dea5de2f33f078':
      '0x9f1f16b025f703ee985b58ced48daf93dad2f7ef',
    '0xcc5913b8fc2256cf378c4e1bd34e99a2a8bb7362':
      '0xf4c0dd9b82da36c07605df83c8a416f11724d88b',
    '0xcfdb87f468806416574ec4e1f05b2d743c3690d8':
      '0x0b09dea16768f0799065c475be02919503cb2a35',
    '0xd3095c5de7b8f4476231c414c69d058f17154afe':
      '0xaac98ee71d4f8a156b6abaa6844cdb7789d086ce',
    '0xd3466427f7ee5d0d9cd68b36df677e51bda26321':
      '0xa660ba113f9aabaeb4bcd28a4a1705f4997d5432',
    '0xd3c8dcfcf2a5203f6a3210591dabea14e181db2d':
      '0x231e687c9961d3a27e6e266ac5c433ce4f8253e4',
    '0xd4a5fc7ea2148d7c560922bbd5dd79a3aec59cfe':
      '0x186084ff790c65088ba694df11758fae4943ee9e',
    '0xd797860e02d87cc20398a07c12416f7d5fb1566c':
      '0x96646936b91d6b9d7d0c47c496afbf3d6ec7b6f8',
    '0xd99e843079dd55e222a845cb6e5876c9e01e256d':
      '0xa6f548df93de924d73be7d25dc02554c6bd66db5',
    '0xddaa60e584338fa251451d6385f6a2b9bde98b2a':
      '0xefaa1604e82e1b3af8430b90192c1b9e8197e377',
    '0xe010fcda8894c16a8acfef7b37741a760faeddc4':
      '0xe99481dc77691d8e2456e5f3f61c1810adfc1503',
    '0xe036cce08cf4e23d33bc6b18e53caf532afa8513':
      '0x5d563ca1e2daaae3402c36097b934630ab53702c',
    '0xe0e6b25b22173849668c85e06bc2ce1f69baff8c':
      '0xaac98ee71d4f8a156b6abaa6844cdb7789d086ce',
    '0xe1a4ce53ae27bdac1366f4d97b10e8586105f2c0':
      '0x0b09dea16768f0799065c475be02919503cb2a35',
    '0xe2eb726bce7790e57d978c6a2649186c4d481658':
      '0x9c08c7a7a89cfd671c79eacdc6f07c1996277ed5',
    '0xe42237f32708bd5c04d69cc77e1e36c8f911a016':
      '0xf4c0dd9b82da36c07605df83c8a416f11724d88b',
    '0xe5ac9548275787cd86df2350248614afab0088ee':
      '0x072f14b85add63488ddad88f855fda4a99d6ac9b',
    '0xe6a44b9b6abef9bec85ceff2e8c138184ea55191':
      '0x3ebf48cd7586d7a4521ce59e53d9a907ebf1480f',
    '0xe79bdd1a9baf6b65339f8ae80d89edd9a790f87a':
      '0x96646936b91d6b9d7d0c47c496afbf3d6ec7b6f8',
    '0xe867be952ee17d2d294f2de62b13b9f4af521e9a':
      '0x3ebf48cd7586d7a4521ce59e53d9a907ebf1480f',
    '0xe93e8aa4e88359dacf33c491cf5bd56eb6c110c1':
      '0x3ebf48cd7586d7a4521ce59e53d9a907ebf1480f',
    '0xe969991ce475bcf817e01e1aad4687da7e1d6f83':
      '0x96646936b91d6b9d7d0c47c496afbf3d6ec7b6f8',
    '0xee8337f497f234442160935f210c73dc47eb2676':
      '0x186084ff790c65088ba694df11758fae4943ee9e',
    '0xee9a6009b926645d33e10ee5577e9c8d3c95c165':
      '0xa6f548df93de924d73be7d25dc02554c6bd66db5',
    '0xf103c397078c4d28eaf99d2925f4dbbd9737bb28':
      '0xe99481dc77691d8e2456e5f3f61c1810adfc1503',
    '0xf1880d81ce7d3b4b0d96ea0665cdb03cb7332c52':
      '0x8339e311265a025fd5792db800daa8eda4264e2c',
    '0xf54025af2dc86809be1153c1f20d77adb7e8ecf4':
      '0xfa22ec1c02f121083bf04fbbcaad019f490d7a30',
    '0xfaac045833b86bb7c8889d146733f09e4c427cfa':
      '0x3ebf48cd7586d7a4521ce59e53d9a907ebf1480f',
    '0xfc1f639cfc02c183e199b7a265a2dcd7b97d4c57':
      '0x3ebf48cd7586d7a4521ce59e53d9a907ebf1480f',
    '0xfe5fa46409a8aacda43e3d32ea9b30d10279a459':
      '0x5c6ee304399dbdb9c8ef030ab642b10820db8f56'
  },
  42: {
    '0xf3ffac7b8e3adf1961edb694e057029749a2e847':
      '0x61d5dc44849c9c87b0856a2a311536205c96c7fd',
    '0xf72bb38b0fd36286b813db509bf6adacb75b8bfc':
      '0x647c1fd457b95b75d0972ff08fe01d7d7bda05df',
    '0x1d50bdffbcb2bf8af6411c691f953eef63a38ecc':
      '0x647c1fd457b95b75d0972ff08fe01d7d7bda05df'
  }
};

const SLIPPAGE_BUFFER = 0.02; // 2%

function calculateJoinPoolAmount(amounts: string[], poolData) {
  const balances = poolData.tokens.map(token => fnum(token.balance));
  const weights = poolData.tokens.map(token => fnum(token.denormWeight));
  const amountsIn = amounts.map(amount => fnum(amount));
  const totalSupply = fnum(poolData.totalSupply);
  const swapFee = fnum(scale(bnum(poolData.swapFee), 18));
  return _exactTokensInForBPTOut(
    balances,
    weights,
    amountsIn,
    totalSupply,
    swapFee
  );
}

export function getNewPool(address: string) {
  return pools[config.chainId][address.toLowerCase()];
}

export function calculateMinAmount(
  isFullMigration,
  poolV1Amount: string,
  poolV1Data,
  poolV2Data
) {
  if (poolV2Data.tokens.length > 2) {
    return '0';
  }
  // TODO return 0 if v1 tokens in not superset of v2

  const fullAmountsIn = poolV2Data.tokens.map(token => {
    const tokenIn = poolV1Data.tokens.find(
      t => t.address === token.address.toLowerCase()
    );
    const shortBalanceNumber = bnum(tokenIn.balance);
    const decimals = tokenIn.decimals;
    const balanceNumber = scale(shortBalanceNumber, decimals);
    const totalSharesNumber = bnum(poolV1Data.totalShares);
    const totalSupplyNumber = scale(totalSharesNumber, 18);
    const amountNumber = balanceNumber
      .times(poolV1Amount)
      .div(totalSupplyNumber);
    return amountNumber.toString();
  });
  const amountRatios = poolV2Data.tokens.map((token, index) => {
    const fullAmountIn = fullAmountsIn[index];
    const amountRatio = bnum(fullAmountIn).div(token.balance);
    return amountRatio;
  });
  const minAmountRatio = amountRatios.reduce((minRatio, ratio) =>
    minRatio.lt(ratio) ? minRatio : ratio
  );
  const propAmountsIn = fullAmountsIn.map((amount, index) => {
    const token = poolV2Data.tokens[index];
    return minAmountRatio.times(token.balance);
  });
  const amountsIn = isFullMigration ? fullAmountsIn : propAmountsIn;
  const poolV2Amount = calculateJoinPoolAmount(amountsIn, poolV2Data);
  const minAmount = poolV2Amount.times(1 - SLIPPAGE_BUFFER);
  return minAmount.toFixed(0);
}

export function calculatePriceImpact(
  poolV1Amount: string,
  poolV1Data,
  poolV2Data
) {
  if (poolV2Data.tokens.length > 2) {
    return 1;
  }
  // TODO return 1 if v1 tokens in not superset of v2

  const amountsIn = poolV2Data.tokens.map(token => {
    const tokenIn = poolV1Data.tokens.find(
      t => t.address === token.address.toLowerCase()
    );
    const shortBalanceNumber = bnum(tokenIn.balance);
    const decimals = tokenIn.decimals;
    const balanceNumber = scale(shortBalanceNumber, decimals);
    const totalSharesNumber = bnum(poolV1Data.totalShares);
    const totalSupplyNumber = scale(totalSharesNumber, 18);
    const amountNumber = balanceNumber
      .times(poolV1Amount)
      .div(totalSupplyNumber);
    return amountNumber.toString();
  });

  const v1Tokens = poolV1Data.tokens;
  const v2Tokens = poolV2Data.tokens;

  const v1TotalWeight = poolV1Data.tokens.reduce(
    (totalWeight, token) => totalWeight.plus(token.denormWeight),
    bnum(0)
  );
  const v2TotalWeight = poolV2Data.tokens.reduce(
    (totalWeight, token) => totalWeight.plus(token.denormWeight),
    bnum(0)
  );

  const baseTokenAddress = v2Tokens[0].address;
  const v1BaseToken = v1Tokens.find(
    token => token.address === baseTokenAddress.toLowerCase()
  );
  const v1BaseTokenBalanceRaw = bnum(v1BaseToken.balance);
  const v1BaseTokenBalance = scale(v1BaseTokenBalanceRaw, v1BaseToken.decimals);
  const v1Liquidity = v1BaseTokenBalance
    .div(v1BaseToken.denormWeight)
    .times(v1TotalWeight);
  const v2BaseToken = v2Tokens.find(
    token => token.address === baseTokenAddress
  );
  const v2BaseTokenBalance = bnum(v2BaseToken.balance);
  const v2Liquidity = v2BaseTokenBalance
    .div(v2BaseToken.denormWeight)
    .times(v2TotalWeight);

  const quoteTokenAddress = v2Tokens[1].address;
  const v1QuoteToken = v1Tokens.find(
    token => token.address === quoteTokenAddress.toLowerCase()
  );
  const v2QuoteToken = v2Tokens.find(
    token => token.address === quoteTokenAddress
  );

  const v1QuoteTokenBalanceRaw = bnum(v1QuoteToken.balance);
  const v1QuoteTokenBalance = scale(
    v1QuoteTokenBalanceRaw,
    v1QuoteToken.decimals
  );

  const v1Price = bnum(v1BaseTokenBalance)
    .times(v1QuoteToken.denormWeight)
    .div(v1QuoteTokenBalance)
    .div(v1BaseToken.denormWeight);
  const v2Price = bnum(v2BaseToken.balance)
    .times(v2QuoteToken.denormWeight)
    .div(v2QuoteToken.balance)
    .div(v2BaseToken.denormWeight);

  const marketPrice = v1Liquidity.gt(v2Liquidity.times(0.1))
    ? v1Price
    : v2Price;

  const priceRatio = marketPrice.div(v2Price).toNumber();
  const baseBalanceAdjusted = bnum(v2BaseToken.balance).times(
    priceRatio **
      (parseFloat(v2QuoteToken.denormWeight) / v2TotalWeight.toNumber())
  );
  const quoteBalanceAdjusted = bnum(v2QuoteToken.balance).times(
    priceRatio **
      (-parseFloat(v2BaseToken.denormWeight) / v2TotalWeight.toNumber())
  );

  const baseAssetPrice = baseBalanceAdjusted
    .times(v2TotalWeight)
    .div(v2BaseToken.denormWeight)
    .div(poolV2Data.totalSupply);
  const quoteAssetPrice = quoteBalanceAdjusted
    .times(v2TotalWeight)
    .div(v2QuoteToken.denormWeight)
    .div(poolV2Data.totalSupply);

  const baseAmounIn = bnum(amountsIn[0]);
  const quoteAmounIn = bnum(amountsIn[1]);

  const poolV2AmountSpot = baseAmounIn
    .div(baseAssetPrice)
    .plus(quoteAmounIn.div(quoteAssetPrice));

  const poolV2Amount = calculateJoinPoolAmount(amountsIn, poolV2Data);

  const one = bnum(1);
  const priceImpact = one.minus(poolV2Amount.div(poolV2AmountSpot));

  return priceImpact.isNegative() ? 0.00001 : priceImpact.toNumber();
}

export function getLeftoverAssets(
  poolV1Amount: string,
  poolV1Data,
  poolV2Data,
  isFullMigration: boolean
) {
  const v1Tokens = poolV1Data.tokens;
  const v2Tokens = poolV2Data.tokens;

  const missingAssets: string[] = [];
  for (const v1Token of v1Tokens) {
    const v2Token = v2Tokens.find(
      v2Token => v1Token.address === v2Token.address.toLowerCase()
    );
    if (!v2Token) {
      missingAssets.push(v1Token.address);
    }
  }

  const amountNumber = bnum(poolV1Amount);
  const totalSharesShort = bnum(poolV1Data.totalShares);
  const totalShares = scale(totalSharesShort, 18);
  const share = amountNumber.div(totalShares);
  const tokenAmounts = v1Tokens.map(token => {
    const amount = share.times(token.balance);
    return {
      address: token.address,
      amount: amount.toFixed(4)
    };
  });

  if (isFullMigration) {
    if (missingAssets.length === 0) {
      return [];
    } else {
      // Return missing asset
      return tokenAmounts.filter(tokenAmount =>
        missingAssets.includes(tokenAmount.address)
      );
    }
  } else {
    let lowestRatio = bnum(1);
    for (const token of v2Tokens) {
      const tokenAmount = tokenAmounts.find(
        amount => token.address.toLowerCase() === amount.address
      ).amount;
      const tokenDecimal = v1Tokens.find(
        v1Token => v1Token.address === token.address.toLowerCase()
      ).decimals;
      const tokenBalance = scale(bnum(token.balance), -tokenDecimal);
      const ratio = bnum(tokenAmount).div(tokenBalance);
      if (ratio.lt(lowestRatio)) {
        lowestRatio = ratio;
      }
    }
    const tokenInAmounts = v2Tokens.map(token => {
      const tokenDecimal = v1Tokens.find(
        v1Token => v1Token.address === token.address.toLowerCase()
      ).decimals;
      const tokenBalance = scale(bnum(token.balance), -tokenDecimal);
      const amount = lowestRatio.times(tokenBalance);
      return {
        address: token.address.toLowerCase(),
        amount
      };
    });

    return tokenAmounts
      .map(tokenAmount => {
        const tokenIn = tokenInAmounts.find(
          tokenInAmount => tokenInAmount.address === tokenAmount.address
        );
        const tokenInAmount = tokenIn ? tokenIn.amount : 0;
        const tokenAmountNumber = bnum(tokenAmount.amount);
        const leftoverAmount = tokenAmountNumber.minus(tokenInAmount);
        return {
          address: tokenAmount.address,
          amount: leftoverAmount.toFixed(4)
        };
      })
      .filter(tokenAmount => parseFloat(tokenAmount.amount) > 0.0000001);
  }
}
