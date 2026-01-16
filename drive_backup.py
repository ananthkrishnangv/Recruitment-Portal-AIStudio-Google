
import os
import datetime
import shutil
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

# Configuration
SCOPES = ['https://www.googleapis.com/auth/drive']
SERVICE_ACCOUNT_FILE = 'service_account.json'
PARENT_FOLDER_NAME = 'Recruitment portal Ai studio'
BACKUP_DIR = 'backups'

def authenticate():
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    return build('drive', 'v3', credentials=creds)

def create_zip_archive():
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR)
    
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"csir_portal_backup_{timestamp}"
    output_path = os.path.join(BACKUP_DIR, filename)
    
    # Create zip excluding node_modules and .git
    print(f"Creating backup archive: {filename}.zip ...")
    shutil.make_archive(output_path, 'zip', root_dir='.', base_dir='.')
    return f"{output_path}.zip"

def get_or_create_folder(service, folder_name):
    query = f"mimeType='application/vnd.google-apps.folder' and name='{folder_name}' and trashed=false"
    results = service.files().list(q=query, fields="files(id, name)").execute()
    files = results.get('files', [])

    if files:
        print(f"Found existing folder: {folder_name} ({files[0]['id']})")
        return files[0]['id']
    else:
        file_metadata = {
            'name': folder_name,
            'mimeType': 'application/vnd.google-apps.folder'
        }
        file = service.files().create(body=file_metadata, fields='id').execute()
        print(f"Created new folder: {folder_name} ({file.get('id')})")
        return file.get('id')

def upload_file(service, filepath, parent_id):
    filename = os.path.basename(filepath)
    file_metadata = {
        'name': filename,
        'parents': [parent_id]
    }
    media = MediaFileUpload(filepath, mimetype='application/zip', resumable=True)
    
    print(f"Uploading {filename} to Google Drive...")
    file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
    print(f"Backup uploaded successfully. File ID: {file.get('id')}")

def main():
    if not os.path.exists(SERVICE_ACCOUNT_FILE):
        print(f"Error: {SERVICE_ACCOUNT_FILE} not found. Please place your Google Cloud Service Account JSON key in the root directory.")
        return

    try:
        service = authenticate()
        folder_id = get_or_create_folder(service, PARENT_FOLDER_NAME)
        zip_path = create_zip_archive()
        upload_file(service, zip_path, folder_id)
        
        # Cleanup
        os.remove(zip_path)
        print("Local backup archive cleaned up.")
        
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    main()
