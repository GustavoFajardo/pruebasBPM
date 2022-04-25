import { Document, Image, Page, PDFDownloadLink, StyleSheet, Text } from '@react-pdf/renderer'
import { useEffect, useState } from 'react'
import { IDataPermission } from '../model/DataPermission'

interface IPDF {
    src: string,
    title: string,
    data: IDataPermission,
    photo: string,
    frontY: string,
    codeY: string,
    frontX: string,
    codeX: string,
    height: number,
    label: string
}

export const PDFCode = (props: IPDF) => {

    const [codeY, setCodeY] = useState(0);
    const [codeX, setCodeX] = useState(0);
    const [frontY, setFrontY] = useState(0);
    const [frontX, setFrontX] = useState(0);


    useEffect(() => {        
        setCodeY(parseInt(props.codeY));
        setCodeX(parseInt(props.codeX));
        setFrontY(parseInt(props.frontY));
        setFrontX(parseInt(props.frontX));
    }, [props.codeX, props.frontX, props.frontY, props.codeY])



    const styles = StyleSheet.create({
        body: {
            paddingTop: (632 + ((isNaN(codeY)) ? 0 : -codeY)),
            paddingBottom: 0,
            paddingHorizontal: (35 + ((isNaN(codeX)) ? 0 : codeX)),
        },
        image: {
            marginVertical: 0,
            marginHorizontal: 154,
            height: 57,
            width: 208
        },
        text: {
            margin: 0,
            fontSize: 8,
            textAlign: 'justify',
        },
    });

    const styles2 = StyleSheet.create({
        body: {
            flexDirection: 'row',
            paddingTop: (617 + ((isNaN(frontY)) ? 0 : -frontY)),
            paddingBottom: 0,
            paddingLeft: (205 + ((isNaN(frontX)) ? 0 : frontX)),
        },
        image: {
            marginVertical: 0,
            marginLeft: 30,
            height: 75,
            width: 55
        },
        text: {
            margin: 0,
            fontSize: 8,
            textAlign: 'justify',
        },
        content: {
            flexDirection: 'row',
        },
    });

    const MyDoc = () => (
        <Document>
            <Page style={styles2.body} size='LETTER'>
                <div>
                    <Text style={styles2.text}>
                        {props.data.Name}
                    </Text>
                    <Text style={styles2.text}>
                        CC.{props.title}
                    </Text>
                    <Text style={styles2.text}>
                        CLASE ARMA: {props.data.ClaseArma}
                    </Text>
                    <Text style={styles2.text}>
                        MARCA: {props.data.Marca}
                    </Text>
                    <Text style={styles2.text}>
                        SERIE No: {props.data.Serie}
                    </Text>
                    <Text style={styles2.text}>
                        CALIBRE: {props.data.Calibre}
                    </Text>
                    <Text style={styles2.text}>
                        CAPACIDAD: {props.data.Capacidad}
                    </Text>
                    <Text style={styles2.text}>
                        VENCE: {props.data.Vence}
                    </Text>
                </div>
                <Image
                    style={styles2.image}
                    src={props.photo}
                />
            </Page>
            <Page style={styles.body} size='LETTER'>
                <Image
                    style={styles.image}
                    src={props.src}
                />
            </Page>
        </Document>
    );


    return (
        <>
            <PDFDownloadLink className="white-link" document={<MyDoc />} fileName={`${props.title}.pdf`}>
                {({ blob, url, loading, error }) =>
                    loading ? '... CARGANDO' : props.label
                }
            </PDFDownloadLink>
        </>
    )
}
