<<<<<<< HEAD
import Address from "../models/Address.js";

const checkAddressBeforePayment = async (req, res, next) => {
  const { addressId } = req.body;

  if (!addressId)
    return res.status(400).json({
      message: "Please select address before payment",
    });

  const address = await Address.findById(addressId);

  if (!address)
    return res.status(400).json({
      message: "Invalid address selected",
    });

  req.selectedAddress = address;
  next();
};

export default checkAddressBeforePayment;
=======
import Address from "../models/Address.js";

const checkAddressBeforePayment = async (req, res, next) => {
  const { addressId } = req.body;

  if (!addressId)
    return res.status(400).json({
      message: "Please select address before payment",
    });

  const address = await Address.findById(addressId);

  if (!address)
    return res.status(400).json({
      message: "Invalid address selected",
    });

  req.selectedAddress = address;
  next();
};

export default checkAddressBeforePayment;
>>>>>>> 00f8281ee8d9b73c8ba973b193294f36d4283ebb
