
export const pipeSort = (array: any[], columna: string) => {    
    try {
        array.forEach((item: any) => {
            if (!item[columna]) {
                item[columna] = '';
            }
        })
        let auxArray = columna !== 'Since' ? [...array].sort((a: any, b: any) => a[columna].toString().localeCompare(b[columna].toString())) : [...array].sort((a: any, b: any) => a[columna].toString().localeCompare(b[columna].toString())).reverse()
        return auxArray
    } catch (error) {
        console.log(error);
        return array;
    }
}






