import re

with open('src/pages/Upload.jsx', 'r') as f:
    content = f.read()

# 1. Better seller initialization error
old_seller_error = """          if (insertError) {
            console.error('Failed to create seller:', insertError)
            alert('Failed to initialize seller. Please refresh.')
          } else {
            setSeller(newSeller)
          }"""

new_seller_error = """          if (insertError) {
            console.error('Failed to create seller:', insertError)
            alert('Unable to connect to the database. Please check your internet connection and try again. If this persists, contact support.')
          } else {
            setSeller(newSeller)
          }"""

content = content.replace(old_seller_error, new_seller_error)

# 2. Better Cloudinary error in handleFileSelect
old_upload_error = """      } catch (err) {
        console.error('Upload failed:', err)
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, uploading: false, error: err.message } : i
          )
        )
      }"""

new_upload_error = """      } catch (err) {
        console.error('Upload failed:', err)
        const friendlyError = err.message?.includes('401') || err.message?.includes('Unauthorized')
          ? 'Image upload failed: Please check your Cloudinary configuration.'
          : err.message?.includes('network') || err.message?.includes('fetch')
          ? 'Upload failed: Please check your internet connection.'
          : 'Upload failed: ' + err.message
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, uploading: false, error: friendlyError } : i
          )
        )
      }"""

content = content.replace(old_upload_error, new_upload_error)

# 3. Better publish error
old_publish_error = """    } catch (err) {
      alert('Publish failed: ' + err.message)
    } finally {"""

new_publish_error = """    } catch (err) {
      const friendlyPublishError = err.message?.includes('401') || err.message?.includes('Unauthorized')
        ? 'Publish failed: Database connection issue. Please check your Supabase configuration.'
        : 'Publish failed: ' + err.message
      alert(friendlyPublishError)
    } finally {"""

content = content.replace(old_publish_error, new_publish_error)

with open('src/pages/Upload.jsx', 'w') as f:
    f.write(content)

print('Error messages improved')
