
var isCanadian = true;

function taxRate() {
    if (isCanadian) {
        return 0.05;
    } else {
        return 0.0;
    }
}

function calculateTax(amount) {
    return amount * taxRate();
}

function calculateTotal(price, quantity) {
    return (price * quantity) + calculateTax(price * quantity);
}
