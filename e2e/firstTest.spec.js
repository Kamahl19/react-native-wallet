describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have select wallet screen', async () => {
    await expect(element(by.text('No wallets'))).toBeVisible();
  });
});
