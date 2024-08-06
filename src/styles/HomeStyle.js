import { StyleSheet, Dimensions } from 'react-native';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const HomeStyle = StyleSheet.create({
	preloader: {
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		position: 'absolute',
	},

	navigationView: {
		width: '100%',
		height: 60,
		backgroundColor: '#8bc34a',
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
	},

	titleText: {
		fontSize: 24,
		fontWeight: '700',
		color: '#f5f5f5'
	},

	settingButton:{
		position: 'absolute',
		width: 80,
		height: 50,
		bottom: 5,
		right: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},


	settingMenu: {
		position: 'absolute',
		top: -2,
		right: 0,
		width: DEVICE_WIDTH * 0.45,
		height: 107,
		zIndex: 2,
		borderWidth: 1,
		borderColor: '#111',
		borderTopColor: '#8bc34a',
	},

	settingMenuItem: {
		width: '100%',
		height: 35,      
		backgroundColor: '#e8f3db',
		alignItems: 'flex-start',
		justifyContent: 'center',
		paddingLeft: 5,
	},

	settingMenuText: {
		fontSize: 13,
		color: '#111',
		margin: 5,
		marginTop: 2,
		marginBottom: 0
	}, 

	contentView: {
		width: '100%',
		flex: 1,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'flex-start',
		zIndex: 1,
	},

	// styles for savedInfo

	savedInfo: {
		margin: 10,
		borderBottomWidth: 1, // Line thickness
    	borderBottomColor: '#595', // Line color
	},

	deleteButton: {
		position: 'absolute', // Position absolutely within title view
	    right: 0, // Align to the right
	    top: 0, // Align to the top
	    padding: 10, // Adjust padding as needed
	},

	deleteButtonText: {
		fontSize: 15,
		color: '#fff',
		top: -3
	},

	openFolderButtonText: {
		fontSize: 15,
		color: '#fff',
		top: -3
	},

	savedInfoItemText: {
		fontSize: 10,
	    textAlign: 'center', // Center text horizontally,
	    color: '#111'
	},

	fileNameText: {
		height: 20, 
		width: '100%', 
		marginTop: 5, 
		paddingRight: 15
	},

	// styles for downloading status
	downloadingStatus: {
		margin: 10
	},

	statusItem: {
	    height: 20,
	    width: '100%',
	    justifyContent: 'center', // Center content vertically
	    alignItems: 'center', // Center content horizontally
	},
	itemText: {
		fontSize: 13,
	    textAlign: 'center', // Center text horizontally
	    color: '#111'
	},

	downloadingButtons: {
	    flexDirection: 'row',
	    justifyContent: 'space-between', // Space buttons evenly
	    margin: 10,
	    marginTop: 20
	},
	button: {
	    flex: 1, // Allow buttons to grow equally
	    marginHorizontal: 5, // Space between buttons
	    justifyContent: 'center',
	    alignItems: 'center',
	    padding: 8,
	    borderColor: '#111',
	    borderWidth: 1,
	    borderRadius: 3,
	    backgroundColor: '#8bc34a33'
	},

	// styles for add torrent buttons
	addButtonsContainer: {
		position: 'absolute',
		bottom: 50,
		right: 10,
		width: 100,
		height: 100,
		flexDirection: 'column', // Stack children vertically
		backgroundColor: 'transparent'
	},
	addTorrentLinkButton: {
		flex: 1, // Takes up half the height of the container
		justifyContent: 'center', // Center the text vertically
		alignItems: 'center', // Center the text horizontally
		backgroundColor: '#8bc34a', // Optional: Add a background color
	},
	gap: {
		height: 10, // Adjust the height of the gap as needed
		backgroundColor: 'transparent', // Transparent gap
	},
	webView: {
		flex: 1, // Takes up half the width of the container
		backgroundColor: 'transparent', // Optional: Add a background color
	},

	// styles for modal
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark background with transparency
	},
	modalContent: {
		width: 320,
		backgroundColor: '#f5f5f5',
		padding: 20,
		borderRadius: 10,
		alignItems: 'center',
	},
	modalTitle: {
		fontSize: 16,
		color: '#111',
		marginBottom: 10,
	},
	textInput: {
		width: '100%',
		height: 40,
		borderColor: '#ccc',
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 10,
		marginBottom: 20,
		color: '#111'
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end', // Align buttons to the right
		width: '100%',
	},
	modalButton: {
	    backgroundColor: '#8bc34a', // Change this color as needed
	    padding: 10,
	    borderRadius: 3,
	    marginHorizontal: 5,
	    alignItems: 'center',
	    width: 100
	},
	modalButtonText: {
	    color: '#111',
	    fontSize: 13,
	},

	cellView: {
		width: DEVICE_WIDTH,
		height: 217,
		marginTop: 5,
	},

	cellContentView: {    
		flex: 1,
		marginHorizontal: 16,
		marginBottom: 10,
		borderRadius: 5,
		borderColor: '#595',
		borderWidth: 1,
		backgroundColor: '#e8f3db',
	},

	cellTitleView: {
		width: '100%',
		height: 32,
		backgroundColor: '#8bc34a55',
		alignItems: 'center',
		justifyContent: 'center',
		borderTopLeftRadius: 4,
		borderLeftWidth: 10,
		borderLeftColor: '#8bc34a'
	},

	cellTitleText: {
		fontSize: 16,
		fontWeight: '500',
		color: '#111'
	},

	scrollView: {
		width: '100%',
		height: 100,
	},

});

export default HomeStyle;