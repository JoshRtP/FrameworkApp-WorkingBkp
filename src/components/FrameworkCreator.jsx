import React, { useState, useEffect } from 'react'
import './FrameworkCreator.css'

function FrameworkCreator({ onSave, onCancel, initialData }) {
  const [frameworkName, setFrameworkName] = useState('')
  const [categories, setCategories] = useState([])
  const [currentCategory, setCurrentCategory] = useState({ name: '', color: '#1F77B4' })
  const [currentType, setCurrentType] = useState({ title: '', description: '' })
  const [currentSubtype, setCurrentSubtype] = useState({ title: '', description: '' })
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null)
  const [selectedTypeIndex, setSelectedTypeIndex] = useState(null)
  const [editMode, setEditMode] = useState({ type: null, index: null })

  useEffect(() => {
    if (initialData) {
      setFrameworkName(initialData.name)
      const categoriesArray = Object.entries(initialData.categories).map(([name, data]) => ({
        name,
        color: data.color,
        types: data.types
      }))
      setCategories(categoriesArray)
    }
  }, [initialData])

  // Category Operations
  const handleAddCategory = () => {
    if (currentCategory.name) {
      setCategories([...categories, { 
        ...currentCategory, 
        types: [] 
      }])
      setCurrentCategory({ name: '', color: '#1F77B4' })
      setEditMode({ type: null, index: null })
    }
  }

  const handleEditCategory = (index, event) => {
    event.stopPropagation() // Prevent triggering selection
    setEditMode({ type: 'category', index })
    setCurrentCategory({ ...categories[index] })
  }

  const handleUpdateCategory = () => {
    if (currentCategory.name && editMode.type === 'category') {
      const updatedCategories = [...categories]
      updatedCategories[editMode.index] = {
        ...updatedCategories[editMode.index],
        name: currentCategory.name,
        color: currentCategory.color
      }
      setCategories(updatedCategories)
      setCurrentCategory({ name: '', color: '#1F77B4' })
      setEditMode({ type: null, index: null })
    }
  }

  const handleDeleteCategory = (index, event) => {
    event.stopPropagation() // Prevent triggering selection
    if (window.confirm('Are you sure you want to delete this category and all its contents?')) {
      const updatedCategories = categories.filter((_, i) => i !== index)
      setCategories(updatedCategories)
      if (selectedCategoryIndex === index) {
        setSelectedCategoryIndex(null)
        setSelectedTypeIndex(null)
      }
      setEditMode({ type: null, index: null })
    }
  }

  const handleSelectCategory = (index) => {
    setSelectedCategoryIndex(index)
    setSelectedTypeIndex(null)
    setEditMode({ type: null, index: null })
  }

  // Type Operations
  const handleAddType = () => {
    if (currentType.title && selectedCategoryIndex !== null) {
      const updatedCategories = [...categories]
      if (!updatedCategories[selectedCategoryIndex].types) {
        updatedCategories[selectedCategoryIndex].types = []
      }
      const newType = {
        ...currentType,
        id: Date.now().toString(),
        subtypes: []
      }
      updatedCategories[selectedCategoryIndex].types.push(newType)
      setCategories(updatedCategories)
      setCurrentType({ title: '', description: '' })
      setEditMode({ type: null, index: null })
    }
  }

  const handleEditType = (typeIndex, event) => {
    event.stopPropagation() // Prevent triggering selection
    setEditMode({ type: 'type', index: typeIndex })
    setCurrentType({ ...categories[selectedCategoryIndex].types[typeIndex] })
  }

  const handleUpdateType = () => {
    if (currentType.title && editMode.type === 'type' && selectedCategoryIndex !== null) {
      const updatedCategories = [...categories]
      updatedCategories[selectedCategoryIndex].types[editMode.index] = {
        ...updatedCategories[selectedCategoryIndex].types[editMode.index],
        title: currentType.title,
        description: currentType.description
      }
      setCategories(updatedCategories)
      setCurrentType({ title: '', description: '' })
      setEditMode({ type: null, index: null })
    }
  }

  const handleDeleteType = (typeIndex, event) => {
    event.stopPropagation() // Prevent triggering selection
    if (window.confirm('Are you sure you want to delete this type and all its subtypes?')) {
      const updatedCategories = [...categories]
      updatedCategories[selectedCategoryIndex].types = updatedCategories[selectedCategoryIndex].types.filter((_, i) => i !== typeIndex)
      setCategories(updatedCategories)
      if (selectedTypeIndex === typeIndex) {
        setSelectedTypeIndex(null)
      }
      setEditMode({ type: null, index: null })
    }
  }

  const handleSelectType = (typeIndex) => {
    setSelectedTypeIndex(typeIndex)
    setEditMode({ type: null, index: null })
  }

  // Subtype Operations
  const handleAddSubtype = () => {
    if (currentSubtype.title && selectedCategoryIndex !== null && selectedTypeIndex !== null) {
      const updatedCategories = [...categories]
      if (!updatedCategories[selectedCategoryIndex].types[selectedTypeIndex].subtypes) {
        updatedCategories[selectedCategoryIndex].types[selectedTypeIndex].subtypes = []
      }
      updatedCategories[selectedCategoryIndex].types[selectedTypeIndex].subtypes.push({
        ...currentSubtype,
        id: Date.now().toString()
      })
      setCategories(updatedCategories)
      setCurrentSubtype({ title: '', description: '' })
      setEditMode({ type: null, index: null })
    }
  }

  const handleEditSubtype = (subtypeIndex, event) => {
    event.stopPropagation() // Prevent triggering selection
    setEditMode({ type: 'subtype', index: subtypeIndex })
    setCurrentSubtype({ ...categories[selectedCategoryIndex].types[selectedTypeIndex].subtypes[subtypeIndex] })
  }

  const handleUpdateSubtype = () => {
    if (currentSubtype.title && editMode.type === 'subtype' && selectedCategoryIndex !== null && selectedTypeIndex !== null) {
      const updatedCategories = [...categories]
      updatedCategories[selectedCategoryIndex].types[selectedTypeIndex].subtypes[editMode.index] = {
        ...updatedCategories[selectedCategoryIndex].types[selectedTypeIndex].subtypes[editMode.index],
        title: currentSubtype.title,
        description: currentSubtype.description
      }
      setCategories(updatedCategories)
      setCurrentSubtype({ title: '', description: '' })
      setEditMode({ type: null, index: null })
    }
  }

  const handleDeleteSubtype = (subtypeIndex, event) => {
    event.stopPropagation() // Prevent triggering selection
    if (window.confirm('Are you sure you want to delete this subtype?')) {
      const updatedCategories = [...categories]
      updatedCategories[selectedCategoryIndex].types[selectedTypeIndex].subtypes = 
        updatedCategories[selectedCategoryIndex].types[selectedTypeIndex].subtypes.filter((_, i) => i !== subtypeIndex)
      setCategories(updatedCategories)
      setEditMode({ type: null, index: null })
    }
  }

  const handleSave = () => {
    if (frameworkName && categories.length > 0) {
      const formattedCategories = {}
      categories.forEach(category => {
        formattedCategories[category.name] = {
          color: category.color,
          types: category.types
        }
      })

      const framework = {
        id: initialData?.id,
        name: frameworkName,
        categories: formattedCategories
      }
      onSave(framework)
    }
  }

  const isValid = frameworkName.trim() !== '' && categories.length > 0 && 
                 categories.every(cat => cat.types && cat.types.length > 0)

  return (
    <div className="framework-creator">
      <h2>{initialData ? 'Edit Framework' : 'Create New Framework'}</h2>
      
      <div className="section">
        <h3>Framework Name</h3>
        <div className="input-group">
          <input 
            type="text" 
            value={frameworkName} 
            onChange={(e) => setFrameworkName(e.target.value)} 
            placeholder="Enter framework name" 
            className="framework-name-input"
          />
        </div>
      </div>

      <div className="section">
        <h3>Categories</h3>
        <div className="input-group">
          <input 
            type="text" 
            value={currentCategory.name} 
            onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })} 
            placeholder="Category name" 
          />
          <div className="color-picker">
            <label>Category Color:</label>
            <input 
              type="color" 
              value={currentCategory.color} 
              onChange={(e) => setCurrentCategory({ ...currentCategory, color: e.target.value })} 
            />
          </div>
          {editMode.type === 'category' ? (
            <button onClick={handleUpdateCategory} className="update-button">
              Update Category
            </button>
          ) : (
            <button 
              onClick={handleAddCategory}
              disabled={!currentCategory.name.trim()}
              className="add-button"
            >
              Add Category
            </button>
          )}
        </div>
        <div className="preview">
          <ul>
            {categories.map((cat, index) => (
              <li 
                key={index} 
                className={`editable-item ${selectedCategoryIndex === index ? 'selected' : ''}`}
                onClick={() => handleSelectCategory(index)}
              >
                <span 
                  style={{ borderLeft: `4px solid ${cat.color}`, paddingLeft: '8px' }}
                >
                  {cat.name}
                </span>
                <div className="item-actions">
                  <button onClick={(e) => handleEditCategory(index, e)} className="edit-button">
                    Edit
                  </button>
                  <button onClick={(e) => handleDeleteCategory(index, e)} className="delete-button">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="section">
        <h3>Types</h3>
        <div className="input-group">
          <input 
            type="text" 
            value={currentType.title} 
            onChange={(e) => setCurrentType({ ...currentType, title: e.target.value })} 
            placeholder="Type title" 
            disabled={selectedCategoryIndex === null}
          />
          <textarea 
            value={currentType.description} 
            onChange={(e) => setCurrentType({ ...currentType, description: e.target.value })} 
            placeholder="Type description" 
            disabled={selectedCategoryIndex === null}
          />
          {editMode.type === 'type' ? (
            <button 
              onClick={handleUpdateType}
              disabled={!currentType.title.trim()}
              className="update-button"
            >
              Update Type
            </button>
          ) : (
            <button 
              onClick={handleAddType}
              disabled={!currentType.title.trim() || selectedCategoryIndex === null}
              className="add-button"
            >
              Add Type
            </button>
          )}
        </div>
        <div className="preview">
          <ul>
            {selectedCategoryIndex !== null && categories[selectedCategoryIndex].types?.map((type, index) => (
              <li 
                key={index}
                className={`editable-item ${selectedTypeIndex === index ? 'selected' : ''}`}
                onClick={() => handleSelectType(index)}
              >
                <span>{type.title}</span>
                <div className="item-actions">
                  <button onClick={(e) => handleEditType(index, e)} className="edit-button">
                    Edit
                  </button>
                  <button onClick={(e) => handleDeleteType(index, e)} className="delete-button">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="section">
        <h3>Subtypes</h3>
        <div className="input-group">
          <input 
            type="text" 
            value={currentSubtype.title} 
            onChange={(e) => setCurrentSubtype({ ...currentSubtype, title: e.target.value })} 
            placeholder="Subtype title" 
            disabled={selectedTypeIndex === null}
          />
          <textarea 
            value={currentSubtype.description} 
            onChange={(e) => setCurrentSubtype({ ...currentSubtype, description: e.target.value })} 
            placeholder="Subtype description" 
            disabled={selectedTypeIndex === null}
          />
          {editMode.type === 'subtype' ? (
            <button 
              onClick={handleUpdateSubtype}
              disabled={!currentSubtype.title.trim()}
              className="update-button"
            >
              Update Subtype
            </button>
          ) : (
            <button 
              onClick={handleAddSubtype}
              disabled={!currentSubtype.title.trim() || selectedTypeIndex === null}
              className="add-button"
            >
              Add Subtype
            </button>
          )}
        </div>
        <div className="preview">
          <ul>
            {selectedTypeIndex !== null && 
             categories[selectedCategoryIndex]?.types[selectedTypeIndex]?.subtypes?.map((subtype, index) => (
              <li key={index} className="editable-item">
                <span>{subtype.title}</span>
                <div className="item-actions">
                  <button onClick={(e) => handleEditSubtype(index, e)} className="edit-button">
                    Edit
                  </button>
                  <button onClick={(e) => handleDeleteSubtype(index, e)} className="delete-button">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="actions">
        <button 
          onClick={handleSave}
          disabled={!isValid}
          className="save"
        >
          {initialData ? 'Save Changes' : 'Save Framework'}
        </button>
        <button onClick={onCancel} className="cancel">
          Cancel
        </button>
      </div>
    </div>
  )
}

export default FrameworkCreator
