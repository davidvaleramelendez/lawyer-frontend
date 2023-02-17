// ** Icons Import
import { 
    CheckSquare, 
    Edit, 
    List, 
    Target, 
    Type 
} from "react-feather"

export const formAddItems = [
    {
        title: 'Input',
        handle: 'input',
        icon: <Type size={14} />,
        default: {
            title: 'Input',
            value: '',
            name: null,
            description: 'Here is the description.',
            placeholder: 'Please input the text'
        }
    },
    {
        title: 'TextArea',
        handle: 'textarea',
        icon: <Edit size={14} />,
        default: {
            title: 'TextArea',
            value: '',
            name: null,
            description: 'Here is the description.',
            placeholder: 'Please enter the text'
        }
    },
    {
        title: 'Radio',
        handle: 'radio',
        icon: <Target size={14} />,
        default: {
            title: 'Radio',
            value: '0',
            name: null,
            description: 'Here is the description.',
            list: [
                {value: '0', label: 'One'},
                {value: '1', label: 'Two'},
                {value: '2', label: 'Three'}
            ]
        }
    },
    {
        title: 'Checkbox',
        handle: 'checkbox',
        icon: <CheckSquare size={14} />,
        default: {
            title: 'Checkbox',
            value: ['0'],
            name: null,
            description: 'Here is the description.',
            list: [
                {value: '0', label: 'One'},
                {value: '1', label: 'Two'},
                {value: '2', label: 'Three'}
            ]
        }
    },
    {
        title: 'Select',
        handle: 'select',
        icon: <List size={14} />,
        default: {
            title: 'Select',
            value: '0',
            name: null,
            description: 'Here is the description.',
            list: [
                {value: '0', label: 'One'},
                {value: '1', label: 'Two'},
                {value: '2', label: 'Three'}
            ]
        }
    }
]