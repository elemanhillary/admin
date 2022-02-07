import React, { useEffect, useState } from "react"
import Button from "../../../../components/fundamentals/button"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import InfoTooltip from "../../../../components/molecules/info-tooltip"
import Input from "../../../../components/molecules/input"
import TagInput from "../../../../components/molecules/tag-input"
import BodyCard from "../../../../components/organisms/body-card"
import VariantGrid from "../../../../components/variant-grid"
import { getCombinations } from "../../../../utils/get-combinations"
import NewOption from "../../details/variants/option-edit"
import { useProductForm } from "../form/product-form-context"

const Variants = ({ isEdit, product }) => {
  const { register, setValue } = useProductForm()
  const [options, setOptions] = useState([])
  const [variants, setVariants] = useState([])
  const [showAddOption, setShowAddOption] = useState(false)

  useEffect(() => {
    const os = [...options]
    const combinations = getCombinations(os)

    const newVariants = combinations.map((optionValues) => {
      if (!optionValues) {
        return null
      }

      const existing = variants.find((v) =>
        v.options.every((value, index) => optionValues[index] === value)
      ) || { prices: [] }

      existing.options = optionValues.filter((v) => v !== "")

      return existing
    })

    setVariants(newVariants.filter((v) => !!v))
  }, [options])

  const updateOptionValue = (index, values) => {
    const newOptions = [...options]
    newOptions[index] = {
      ...newOptions[index],
      values,
    }

    setValue(`options[${index}].values`, values)
    setOptions(newOptions)
  }

  const handleRemoveOption = (index) => {
    const newOptions = [...options]
    newOptions.splice(index, 1)
    setOptions(newOptions)
  }

  const handleAddOption = (e) => {
    setOptions([
      ...options,
      {
        name: "",
        values: [],
      },
    ])
  }

  const updateOptionName = (e, index) => {
    const element = e.target
    const newOptions = [...options]
    newOptions[index] = {
      ...newOptions[index],
      name: element.value,
    }

    setValue(`options[${index}].name`, element.value)
    setOptions(newOptions)
  }

  useEffect(() => {
    if (product?.variants) {
      const variants = product?.variants?.map((v) => ({
        ...v,
        options: v.options.map((o) => ({
          ...o,
          title: product.options.find((po) => po.id === o.option_id)?.title,
        })),
      }))

      setVariants(variants)
    }
  }, [product])

  console.log(variants)

  return (
    <BodyCard
      title="Variants"
      subtitle="Add variations of this product. Offer your customers different options for price, color, format, size, shape, etc."
      forceDropdown={true}
      actionables={
        isEdit && [
          {
            label: "Edit options",
            onClick: () => setShowAddOption(true),
            icon: null,
          },
        ]
      }
    >
      <div>
        <div className="flex items-center mb-base">
          <h6 className="inter-base-semibold text-grey-90 mr-1.5">
            Product Options
          </h6>
        </div>
        <div className="flex flex-col gap-y-base w-full mb-4">
          {options.map((o, index) => (
            <div key={index} className="flex items-center">
              <div className="flex gap-x-small grow">
                <Input
                  required
                  className="w-[144px]"
                  name={`options[${index}].name`}
                  onChange={(e) => updateOptionName(e, index)}
                  label="Option title"
                  placeholder="Color"
                  value={o.name}
                />
                <TagInput
                  className="grow"
                  placeholder="Blue, Green"
                  values={o.values}
                  onChange={(values) => updateOptionValue(index, values)}
                />
              </div>
              <button
                className="ml-large"
                onClick={() => handleRemoveOption(index)}
              >
                <TrashIcon />
              </button>
            </div>
          ))}
          <div className="mt-xs">
            <Button onClick={handleAddOption} size="small" variant="ghost">
              + Add an option
            </Button>
          </div>
        </div>
        <div className="flex justify-center mb-base flex-col space-y-2">
          <div className="flex space-x-2">
            <h6 className="inter-base-semibold text-grey-90">Variants</h6>
            <InfoTooltip content="Add product options to create variants" />
          </div>
          <span className="inter-small-regular text-grey-50">
            Edit variants after creating the product
          </span>
        </div>
        <VariantGrid edit={isEdit} product={product} variants={variants} />
      </div>
      {showAddOption && (
        <NewOption
          productId={product.id}
          options={product.options}
          onDismiss={() => setShowAddOption(false)}
        />
      )}
    </BodyCard>
  )
}

export default Variants
