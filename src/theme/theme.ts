export interface Theme{
    primaryBackground:string;
    secondaryBackground:string;
    heading:string;
    headerBgColor:string;
    headerText:string;
    inputBackground:string;
    inputText:string;
    textColor:string;
    buttonBackground:string;
    loginInputText:string;
    modalOverlay:string;
    modalContent:string;
    modalTitle:string;
}
export const themes={
    light:{
        primaryBackground: '#FAFAF9',
        secondaryBackground:'#F3F3F2',
        headerBgColor:'#F1F5F9',
        heading: '#000000',
        headerText:'#16213E',
        inputBackground: '#F2F2F2',
        inputBorder: '#CCCCCC',
        inputText: '#000000',
        textColor:'#FFFFFF',
        buttonBackground: '#4CAF50',
        borderInputColor:'#E0E0DF',
        loginInputText:'',
        textInputPlaceholder:' #000000',
        modalOverlay:'rgba(0, 0, 0, 0.5)',
        modalContent:'#F8FAFC',
        modalTitle:'#16213E',
        optionsButton:'#28A745'
    },
    dark:{
        primaryBackground: '#16213E',
        headerBgColor:'#1F2A44',
        headerText:'#BEBEBE',
        textColor:'#FFFFFF',
        secondaryBackground:'#2A2A2A',
        heading: '#FFFFFF',
        inputBackground: '#1F2A44',
        inputBorder: '#555555',
        inputText: '#FFFFFF',
        buttonBackground: '#6200EE',
        borderInputColor:'#444443',
        loginInputText:'#9A9A9A',
        textInputPlaceholder:'#BEBEBE',
         modalOverlay:'rgba(0, 0, 0, 0.7)',
         modalContent:'#1F2A44',
         modalTitle:'#E8E8E8',
         optionsButton:'#2FD159'

    }
};