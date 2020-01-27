function getWoman() {
    for (let i = 0; i < allWomenBornAfter1993.length; i++) {
        let woman = allWomenBornAfter1993[i];
        if (!woman.canCook &&
            woman.lie &&
            woman.twerk &&
            woman.canChargeTheyFone &&
            woman.macDonals &&
            woman.dead)
            return woman;
    }
    return null;
}