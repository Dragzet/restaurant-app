import React from "react";
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    StepIconProps,
    styled,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

const steps = ["Ожидается", "В пути", "Доставлен"];

const statusIndexMap: Record<string, number> = {
    pending: 0,
    "on the way": 1,
    delivered: 2,
};

// Стилизованная иконка шага
const StepIconRoot = styled("div")<{
    ownerState: { active: boolean; completed: boolean };
}>(({ ownerState }) => ({
    width: 32,
    height: 32,
    borderRadius: "50%",
    backgroundColor: ownerState.completed || ownerState.active ? "#4caf50" : "#000",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    fontSize: "1rem",
    transition: "all 0.3s ease",
}));

function CustomStepIcon(props: StepIconProps) {
    const { active, completed, icon, className } = props;

    return (
        <StepIconRoot className={className} ownerState={{ active: !!active, completed: !!completed }}>
            {completed ? <CheckIcon fontSize="small" /> : icon}
        </StepIconRoot>
    );
}

const DeliveryStatusStepper: React.FC<{ status: string }> = ({ status }) => {
    const activeStep = statusIndexMap[status] ?? 0;

    return (
        <Box sx={{ width: "100%" }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                    <Step key={index}>
                        <StepLabel
                            StepIconComponent={CustomStepIcon}
                            sx={{
                                "& .MuiStepLabel-label": {
                                    color:
                                        index === activeStep
                                            ? "#4caf50"
                                            : index < activeStep
                                                ? "#4caf50"
                                                : "#aaa",
                                    fontWeight: index === activeStep ? 700 : 400,
                                },
                            }}
                        >
                            {label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
};

export default DeliveryStatusStepper;
