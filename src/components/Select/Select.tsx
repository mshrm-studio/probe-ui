import SelectOption from '@/utils/dto/SelectOption'
import SelectValue from '@/utils/dto/SelectValue'
import styles from '@/styles/select.module.css'
import SearchSelect from '@/components/SearchSelect/SearchSelect'

type Props = {
    disabled?: boolean
    id?: string
    label?: string
    name?: string
    options: SelectOption[]
    required?: boolean
    search?: boolean
    selected: SelectValue
    setSelected: React.Dispatch<React.SetStateAction<SelectValue>>
}

export default function Select({
    disabled,
    id,
    label,
    name,
    options,
    required,
    search,
    selected,
    setSelected,
}: Props) {
    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelected(e.target.value === '' ? undefined : e.target.value)
    }

    if (search)
        return (
            <SearchSelect
                disabled={disabled}
                label={label}
                options={options}
                required={required}
                selected={selected}
                setSelected={setSelected}
            />
        )

    return (
        <div className={styles.selectWrapper}>
            {label && (
                <label className={styles.label} htmlFor={id}>
                    {label}
                </label>
            )}

            <select
                className={styles.select}
                disabled={disabled}
                name={name}
                id={id}
                required={required}
                value={selected || undefined}
                onChange={onChange}
            >
                <option value="">{required ? 'Select' : 'Any'}</option>

                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}
