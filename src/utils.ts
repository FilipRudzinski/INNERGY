export function compareArrays(list1: any[], list2: any[]): boolean {
    if (list1.length != list2.length) return false;
    let equals = true;
    list1 = list1.sort();
    list2 = list2.sort();
    list1.forEach(function (element: any, index: number) {
        let mismatch = list2[index] != element;
        if (mismatch) equals = false;
    })
    return equals;
}