const { ethers } = require("hardhat");

async function main() {
 // Lấy địa chỉ của các contract đã deploy
 const dealComerceAddress = "0xAacd754dB17e0d46fdE1f424B27C56d530C85870";
 const DealComerce = await ethers.getContractAt("DealComerce", dealComerceAddress);
  // 1. Tương tác với UserComerce
 async function userInteractions() {
   // Đăng ký user mới
   const tx1 = await DealComerce.SignUp("John Doe", 25, "john@example.com");
   await tx1.wait();
   console.log("Đã đăng ký user mới");
    // Kiểm tra thông tin user
   const userInfo = await DealComerce.users(await ethers.provider.getSigner().getAddress());
   console.log("Thông tin user:", userInfo);
 }
  // 2. Tương tác với SellerComerce
 async function sellerInteractions() {
   // Tạo seller mới
   const tx2 = await DealComerce.createSeller("My Shop", "shop@example.com");
   await tx2.wait();
   console.log("Đã tạo seller mới");
    // Upload sản phẩm
   const productId = "PROD001";
   const quantity = 100;
   const price = ethers.utils.parseEther("0.1"); // 0.1 ETH
   const tx3 = await DealComerce.uploadItems(productId, quantity, price);
   await tx3.wait();
   console.log("Đã upload sản phẩm mới");
    // Kiểm tra thông tin sản phẩm
   const [qty, prc] = await DealComerce.getDetailProduct(productId);
   console.log("Chi tiết sản phẩm:", {
     quantity: qty.toString(),
     price: ethers.utils.formatEther(prc)
   });
 }
  // 3. Tương tác với DealComerce
 async function dealInteractions() {
   const productId = "PROD001";
   const amount = 2;
   const price = ethers.utils.parseEther("0.1");
   const totalValue = price.mul(amount);
    // Tạo deal mới
   const tx4 = await DealComerce.createDeal(
     productId,
     amount,
     { value: totalValue }
   );
   await tx4.wait();
   console.log("Đã tạo deal mới");
    // Lấy dealId của user
   const userAddress = await ethers.provider.getSigner().getAddress();
   const dealId = await DealComerce.getDealId(userAddress);
   console.log("Deal ID của user:", dealId.toString());
    // Hoàn thành deal
   const tx5 = await DealComerce.completeDeal(dealId);
   await tx5.wait();
   console.log("Đã hoàn thành deal");
 }
  try {
   // Thực thi các hàm tương tác
   await userInteractions();
   await sellerInteractions();
   await dealInteractions();
 } catch (error) {
   console.error("Lỗi:", error);
 }

const balance = await ethers.provider.getBalance("your-address");
console.log("Balance:", ethers.utils.formatEther(balance));

main()
 .then(() => process.exit(0))
 .catch((error) => {
   console.error(error);
   process.exit(1);
 });
}