import React, {useState} from "react";
import SASB_Materiality_Assessment_CG_Mineral_Processing from "../../assets/img/SASB_Materiality_Assessment_CG_Mineral_Processing.PNG"
import SASB_Materiality_Assessment_Services_Transportation from "../../assets/img/SASB_Materiality_Assessment_Services_Transportation.PNG"
import SASB_Materiality_Assessment_Services_Tech_Comm from "../../assets/img/SASB_Materiality_Assessment_Services_Tech_Comm.PNG"
import SASB_Materiality_Assessment_Financials_F_B from "../../assets/img/SASB_Materiality_Assessment_Financials_F_B.PNG"
import SASB_Materiality_Assessment_Renew_Resource_Transf from "../../assets/img/SASB_Materiality_Assessment_Renew_Resource_Transf.PNG"
import SASB_Materiality_Assessment_HealthCare_Infra from "../../assets/img/SASB_Materiality_Assessment_HealthCare_Infra.PNG"
import {Card, Button, CardTitle, CardText, Row, Col, Collapse, CardBody} from 'reactstrap';



const MaterialityMap = (props) =>{

    const images = [
        {
            src:SASB_Materiality_Assessment_CG_Mineral_Processing,
            title:"SASB Materiality Assessment CG_Mineral Processing"
        },
        {
            src:SASB_Materiality_Assessment_Services_Transportation,
            title:"SASB Materiality Assessment Services Transportation"
        },
        {
            src:SASB_Materiality_Assessment_Services_Tech_Comm,
            title:"SASB Materiality Assessment Services Tech Comm"
        },
        {
            src:SASB_Materiality_Assessment_Financials_F_B,
            title:"SASB Materiality Assessment Financials F B"
        },
        {
            src:SASB_Materiality_Assessment_Renew_Resource_Transf,
            title:"SASB Materiality Assessment Renew Resource Transf"
        },
        {
            src:SASB_Materiality_Assessment_HealthCare_Infra,
            title:"SASB Materiality Assessment HealthCare Infra"
        },
    ]

    return(
        <div className="container">
            <div className="row">
                {
                    images.map((image,index)=>{
                        return(
                            <ImageCard key={index} image={image}/>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default MaterialityMap

const ImageCard = ({image,key})=>{
    let [open,setOpen] = useState(false)

    return(
        <Col sm="12" key={key}>
            <Card body>
                <CardTitle>SASB Materiality Assessment</CardTitle>
                <CardText>{image.title}</CardText>
                <Collapse isOpen={open}>
                    <Card>
                        <CardBody>
                            <img className="img-fluid" src={image.src} alt=""/>
                        </CardBody>
                    </Card>
                </Collapse>
                <Button onClick={(e)=>setOpen(prevState=>!prevState)}>
                    {
                        open? "Hide":"View"
                    }
                </Button>
            </Card>

        </Col>
    )
}