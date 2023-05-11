//number formatter for indonesian currency
const formatter = Intl.NumberFormat("id-ID", {
  style: "currency",
    currency: "IDR",    
});

export default formatter;
